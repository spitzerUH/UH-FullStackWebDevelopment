const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('../models/user')
const { test, after, describe, beforeEach } = require('node:test')
const { usersInDb } = require('./test_helper')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
})

describe('when there is initially one user in db', () => {
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map((u) => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

describe('get users from database', () => {
    test('only one user', async () => {
        const usersAtStart = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const { username } = usersAtStart.body[0]
        assert.equal(usersAtStart.body.length, 1)
        assert.deepStrictEqual({ username }, { username: 'root' })
    })
})


describe('add invalid user', () => {
    test('passwort too short', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'sn',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        // console.log(result);


        const usersAtEnd = await usersInDb()
        assert(result.body.error.includes('password has to be at least 3 characters'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        assert.equal(usersAtStart.length, 1)
    })
    test('username too short', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'rt',
            name: 'Superuser',
            password: 'snasdf',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        // console.log(result);


        const usersAtEnd = await usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        assert.equal(usersAtStart.length, 1)
    })
    test('username not unique', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: usersAtStart[0].username,
            name: 'Superuser',
            password: 'snasdf',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)


        const usersAtEnd = await usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        assert.equal(usersAtStart.length, 1)
    })
});


after(async () => {
    await mongoose.connection.close()
})
