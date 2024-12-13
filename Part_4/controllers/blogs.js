const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const user = request.user

    const newBlogObject = request.body

    if (!user)
        response.sendStatus(401)

    newBlogObject.user = user.id
    const blog = new Blog(newBlogObject)

    result = await blog.save()

    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    const idToDelete = request.params.id

    let blogToDelete = await Blog.findById(idToDelete)

    if (!blogToDelete) response.sendStatus(404)

    if (!blogToDelete.user || blogToDelete.user.toString() === request.user.id.toString()) {
        const deletedBlog = await Blog.findOneAndDelete(idToDelete)
        if (!deletedBlog) response.sendStatus(404)
    } else {
        response.sendStatus(403)
    }

    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const idToUpdate = request.params.id
    const { likes } = request.body

    const updatedBlog = await Blog.findOneAndUpdate(
        { _id: idToUpdate },
        {
            likes,
        },
        { new: true }
    )

    if (!updatedBlog) response.sendStatus(404)
    response.json(updatedBlog)
})

module.exports = blogsRouter
