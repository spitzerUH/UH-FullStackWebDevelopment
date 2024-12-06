const User = require('../models/user')
const bcrypt = require('bcryptjs')

const usersInDb = async () => {
    const users = await User.find({})
    return users.map((u) => u.toJSON())
}

const createTestUser = async () => {
    const passwordHash = await bcrypt.hash('password')
    const user = new User({ username: 'root', passwordHash })
    // const user = new User({ username: "user", password: "password" })
    await user.save()

    return user
}

const blogsListTests = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0,
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0,
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0,
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0,
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0,
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0,
    },
]

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0,
    },
]

const initialBlogs = [
    {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        url: 'https://example.com/clean-code',
        likes: 10,
    },
    {
        title: 'The Pragmatic Programmer',
        author: 'Andy Hunt',
        url: 'https://example.com/pragmatic-programmer',
        likes: 8,
    },
    {
        title: 'Refactoring',
        author: 'Martin Fowler',
        url: 'https://example.com/refactoring',
        likes: 12,
    },
    {
        title: 'Code Complete',
        author: 'Steve McConnell',
        url: 'https://example.com/code-complete',
        likes: 7,
    },
    {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        url: 'https://example.com/algorithms',
        likes: 15,
    },
    {
        title: 'The Mythical Man-Month',
        author: 'Fred Brooks',
        url: 'https://example.com/mythical-man-month',
        likes: 5,
    },
    {
        title: 'Test Driven Development',
        author: 'Kent Beck',
        url: 'https://example.com/tdd',
        likes: 20,
    },
    {
        title: 'Patterns of Enterprise Application Architecture',
        author: 'Martin Fowler',
        url: 'https://example.com/poeaa',
        likes: 10,
    },
    {
        title: 'The Art of Computer Programming',
        author: 'Donald Knuth',
        url: 'https://example.com/taocp',
        likes: 18,
    },
]

module.exports = {
    initialBlogs,
    listWithOneBlog,
    blogsListTests,
    usersInDb,
    createTestUser
}
