const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { initialBlogs, createTestUser } = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let testUser = undefined
let token = ""

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    res = await api
        .post('/api/users')
        .send({
            username: 'user',
            password: 'password'
        })
        .set('Accept', 'application/json')
        .expect(201)

    res = await api
        .post('/api/login')
        .send({
            username: 'user',
            password: 'password'
        })
        .set('Accept', 'application/json')

    // console.log(res.error);

    token = res.body.token

    const newBlogs = initialBlogs.map((b) => new Blog(b))
    const promiseArray = newBlogs.map((b) => b.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

describe('request blogs', () => {
    test('return right number of blogs with mongoose', async () => {
        const blogs = await Blog.find({})

        assert.equal(blogs.length, initialBlogs.length)
    })

    test('return right number of blogs with supertest', async () => {
        const res = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.equal(res.body.length, initialBlogs.length)
    })
})

describe('blog id', () => {
    test('verify id name', async () => {
        const response = await api.get('/api/blogs')

        const blogs = response.body
        blogs.forEach((blog) => {
            assert.equal(blog.hasOwnProperty('id'), true)
            assert.equal(blog.hasOwnProperty('_id'), false)
        })
    })
})

describe('blog creation', () => {
    test('verify that post gets created', async () => {
        const curCount = initialBlogs.length

        await api
            .post('/api/blogs')
            .send({
                title: 'The Clean Coder',
                author: 'Robert C. Martin',
                url: 'https://example.com/clean-coder',
                likes: 12,
            })
            .set({ Authorization: `Bearer ${token}` })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)

        const newBlogs = await api
            .get('/api/blogs')
            .send({})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)

        assert.equal(newBlogs.body.length, curCount + 1)
    })
})

describe('blog type verification', () => {
    test('likes default to 0', async () => {
        const blog = await api
            .post('/api/blogs')
            .send({
                title: 'The Clean Coder',
                author: 'Robert C. Martin',
                url: 'https://example.com/clean-coder',
            })
            .set({ Authorization: `Bearer ${token}` })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
        assert.equal(blog.body.likes, 0)

        const newBlogs = await api
            .get('/api/blogs')
            .send({})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)

        assert.equal(newBlogs.body[newBlogs.body.length - 1].likes, 0)
    })
})

describe('blog creation missing parameters', () => {
    test('no title', async () => {
        await api
            .post('/api/blogs')
            .send({
                author: 'Robert C. Martin',
                url: 'https://example.com/clean-coder',
            })
            .set({ Authorization: `Bearer ${token}` })
            .set('Accept', 'application/json')
            .expect(400)
    })
    test('no url', async () => {
        await api
            .post('/api/blogs')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: 'The Clean Coder',
                author: 'Robert C. Martin',
            })
            .set('Accept', 'application/json')
            .expect(400)
    })
    test('no title and url', async () => {
        await api
            .post('/api/blogs')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                author: 'Robert C. Martin',
            })
            .set('Accept', 'application/json')
            .expect(400)
    })
})

describe('deleting blogs via /api/blogs/:id', () => {
    test('successfully deletes a blog', async () => {
        const blogsAtStart = await Blog.find({})
        const blogToDelete = blogsAtStart[0]

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

        const blogsAtEnd = await Blog.find({})

        assert.equal(blogsAtStart.length - 1, blogsAtEnd.length)

        assert.equal(
            blogsAtEnd.findIndex((b) => b.title == blogToDelete.title),
            -1
        )
    })

    test('returns 404 if blog does not exist', async () => {
        const blogsAtStart = await Blog.find({})
        const blogToDelete = blogsAtStart[0]

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(404)
    })

    test('returns 400 if ID is invalid', async () => {
        await api.delete('/api/blogs/invalid-id').expect(400)
    })
})

describe('update blog via  /api/blogs/:id', () => {
    test('successfully updates the number of likes', async () => {
        const blogsAtStart = await Blog.find({})
        const blogToUpdate = blogsAtStart[0]

        const updatedLikes = { likes: blogToUpdate.likes + 10 }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedLikes)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.equal(response.body.likes, updatedLikes.likes)

        const blogsAtEnd = await Blog.find({})
        assert.equal(blogsAtEnd[0].likes, updatedLikes.likes)
    })

    test('returns 404 if blog does not exist', async () => {
        const nonExistentId = new mongoose.Types.ObjectId()
        const updatedLikes = { likes: 10 }

        await api
            .put(`/api/blogs/${nonExistentId}`)
            .send(updatedLikes)
            .expect(404)
    })

    test('returns 400 if _id is invalid', async () => {
        await api.put('/api/blogs/invalid-id').send({ likes: 10 }).expect(400)
    })
})


describe('create blog with user', () => {
    test('token unset', async () => {
        const blog = await api
            .post('/api/blogs')
            .send({
                title: 'The Clean Coder',
                author: 'Robert C. Martin',
                url: 'https://example.com/clean-coder',
            })
            // .set({ Authorization: `Bearer ${token}` })
            .set('Accept', 'application/json')
            .expect(401)
    })
})

after(async () => {
    await mongoose.connection.close()
})
