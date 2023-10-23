const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there is initial number of blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('the first blog is about HTTP methods', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].title).toBe('12345678')
})

test('response contains id property', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: 'sample title',
        author: 'blog author',
        url: 'https://google.com',
        likes: 2
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const inDb = await helper.blogsInDb()
    expect(inDb.length).toBe(helper.initialBlogs.length + 1)

    const contents = inDb.map(b => b.title)
    expect(contents).toContain('sample title')
})

test('if likes property is missing, it will default to 0', async () => {
    const newBlog = {
        title: 'sample title',
        author: 'blog author',
        url: 'https://google.com'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length + 1)

    const latestBlog = response.body[response.body.length - 1]
    expect(latestBlog.likes).toBe(0)
})

test('if title or url properties are missing, it will return status 400', async () => {
    const newBlog = {
        author: 'blog author'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('delete blog', async () => {
    await api
        .delete(`/api/blogs/${helper.initialBlogs[0]._id}`)
        .expect(204)

    const inDb = await helper.blogsInDb()
    expect(inDb.length).toBe(helper.initialBlogs.length - 1)
})

test('update blog', async () => {
    const newBlog = {
        likes: 10,
    }

    await api
        .put(`/api/blogs/${helper.initialBlogs[0]._id}`)
        .send(newBlog)
        .expect(200)

    const response = await api.get('/api/blogs')
    expect(response.body[0].likes).toBe(10)
})

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

afterAll(async () => {
    await mongoose.connection.close()
})