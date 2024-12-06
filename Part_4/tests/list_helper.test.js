const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { listWithOneBlog, blogsListTests } = require('./test_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('bigger list calculated right', () => {
        const result = listHelper.totalLikes(blogsListTests)
        assert.strictEqual(result, 36)
    })

    test('empty list is zero', () => {
        const result = listHelper.totalLikes([])
        assert.strictEqual(result, 0)
    })
})

describe('favorite blog', () => {
    test('empty list is undefined', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, undefined)
    })

    test('big list with one favorite', () => {
        const result = listHelper.favoriteBlog(blogsListTests)
        assert.deepStrictEqual(result, {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            likes: 12,
        })
    })

    test('list with only one entry', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.deepStrictEqual(result, {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5,
        })
    })
})

describe('most blogs', () => {
    test('empty list is undefined', () => {
        const result = listHelper.mostBlogs([])
        assert.strictEqual(result, undefined)
    })

    test('big list with one result', () => {
        const result = listHelper.mostBlogs(blogsListTests)
        assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
    })

    test('list with only one entry', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        assert.deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            blogs: 1,
        })
    })
})

describe('most likes', () => {
    test('empty list is undefined', () => {
        const result = listHelper.mostLikes([])
        assert.strictEqual(result, undefined)
    })

    test('big list with one result', () => {
        const result = listHelper.mostLikes(blogsListTests)
        assert.deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            likes: 17,
        })
    })

    test('list with only one entry', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        assert.deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            likes: 5,
        })
    })
})
