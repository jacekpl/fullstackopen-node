const blogsRouter = require('express').Router()
const Blog = require("../models/blog");

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)
    if (!blog.likes) {
        blog.likes = 0
    }

    if(!blog.title || !blog.url) {
        response.status(400).end()
    }

    try {
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog);
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter