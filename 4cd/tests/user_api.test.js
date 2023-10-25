const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const mongoose = require("mongoose");

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('pass', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('user cannot be created if username is not passed', async () => {
        const newUser = {
            name: 'user',
            password: 'pass'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(result.body.error).toContain('Username is missing')
    })

    test('user cannot be created if password is not passed', async () => {
        const newUser = {
            username: 'user',
            name: 'user'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(result.body.error).toContain('Password is missing')
    })

    test('user cannot be created if password is shorter than 3 characters', async () => {
        const newUser = {
            username: 'user',
            name: 'user',
            password: 'xx'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(result.body.error).toContain('Password must be at least 3 characters long')
    })

    test('user cannot be created if username is shorter than 3 characters', async () => {
        const newUser = {
            username: 'xx',
            name: 'user',
            password: 'xxxxx'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(result.body.error).toContain('Username must be at least 3 characters long')
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})