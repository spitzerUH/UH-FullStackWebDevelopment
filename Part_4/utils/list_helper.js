const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((cur, b) => cur + b.likes, 0)
}

const favoriteBlog = (blogs) => {
    const favBlog = blogs.reduce(
        (prev, current) =>
            prev && prev.likes > current.likes ? prev : current,
        undefined
    )

    return favBlog
        ? {
              title: favBlog.title,
              author: favBlog.author,
              likes: favBlog.likes,
          }
        : undefined
}

const mostBlogs = (blogs) => {
    const group = _.groupBy(blogs, 'author')
    const temp = _.map(group, (value, key) => ({
        author: key,
        blogs: value.length,
    }))
    return _.maxBy(temp, 'blogs')
}

const mostLikes = (blogs) => {
    const group = _.groupBy(blogs, 'author')
    const temp = _.map(group, (value, key) => ({
        author: key,
        likes: _.sumBy(value, (entry) => entry.likes),
    }))
    return _.maxBy(temp, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}
