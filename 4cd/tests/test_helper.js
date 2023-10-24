const Blog = require('../models/blog')
const User = require('../models/user')

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

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb, usersInDb
}