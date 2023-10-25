const blogsRouter = require('express').Router()
const Blog = require("../models/blog");
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require("../utils/middleware");

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user', {username: 1, name: 1})
    response.json(blog)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const user = request.user

    const blog = new Blog(
        {
            "title": request.body.title,
            "author": request.body.author,
            "url": request.body.url,
            "likes": request.body.likes,
            "user": user.id
        })

    if (!blog.likes) {
        blog.likes = 0
    }

    if (!blog.title || !blog.url) {
        response.status(400).end()
    }

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog);
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if(!blog) {
        return response.status(404).json({error: 'blog not found'})
    }

    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({error: 'cannot delete, you are not an author'})
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response, next) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if(!blog) {
        return response.status(404).json({error: 'blog not found'})
    }

    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({error: 'cannot update, you are not an author'})
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {new: true})
    response.json(updatedBlog)
})

module.exports = blogsRouter