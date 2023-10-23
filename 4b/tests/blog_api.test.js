const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    "_id": "65369fc4757f50cd981ed0bc",
    "title": "12345678",
    "author": "aaa bbb",
    "url": "http://www.google.com",
    "__v": 0
  },
  {
    "_id": "65369feb757f50cd981ed0bf",
    "title": "good blog",
    "author": "test",
    "url": "https://fullstackopen.com",
    "__v": 0
  },
  {
    "_id": "6536bc2fffa0da944d3375ed",
    "title": "good blog2",
    "author": "test2",
    "url": "https://fullstackopen.com/2",
    "__v": 0
  }
]

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there is initial number of blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].title).toBe('12345678')
})

test('response contains id property', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
})

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()
})

afterAll(async () => {
  await mongoose.connection.close()
})