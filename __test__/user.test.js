const app = require('../server')
const request = require('supertest')
const { sequelize } = require('../models')
// const { Users } = require("../models")

const UserData = {
    fullName: 'fadhil',
    email: 'admin@gmail.com',
    password: 'admin123',
    gender: 'male',
}

let token
let userId
// console.log(token)

describe('POST /api/v1/users/register', () => {
    it('should send response with a 201 status code', async () => {
        const res = await request(app).post('/api/v1/users/register').send({
            fullName: 'fadhil',
            email: 'admin6@gmail.com',
            password: 'admin123',
            gender: 'male',
        })
        expect(res.statusCode).toEqual(201)
        expect(res.body.code).toBe(201)
        expect(res.body.status).toBe('CREATED')
        expect(res.body.data).toBeDefined()
    })
    it('should return 400 status code if the email is already registered', async () => {
        const res = await request(app).post('/api/v1/users/register').send({
            fullName: 'fadhil',
            email: 'admin6@gmail.com',
            password: 'admin123',
            gender: 'male',
        })
        expect(res.statusCode).toEqual(400)
        expect(res.body.code).toBe(400)
        expect(res.body.status).toBe('BAD_REQUEST')
        expect(res.body.error).toBeDefined()
        expect(res.body.error.email).toBe('Email must be unique')
    })
})

describe('POST /api/v1/users/login', () => {
    it('should send response with a 200 status code', async () => {
        const res = await request(app).post('/api/v1/users/login').send({
            email: 'admin6@gmail.com',
            password: 'admin123',
        })
        expect(res.statusCode).toEqual(200)
        expect(res.body.status).toBe('OK')
        expect(res.body.data).toBeDefined()
        expect(res.body.data).toHaveProperty('token')

        // console.log(res.body.data.token)
        // token = res.body.data.token
    })
    it('should send response with a 422 status code because email or password null', async () => {
        const res = await request(app).post('/api/v1/users/login').send({
            password: 'admin123',
        })
        expect(res.statusCode).toEqual(422)
        expect(res.body.status).toBe('UNPROCESSABLE_CONTENT')
        expect(res.body.error).toBeDefined()
        expect(res.body.error).toBe("Email or password can't be empty!")
    })
    it('should send response with a 401 status code because email not found', async () => {
        const data = {
            email: 'admin2@gmail.com',
            password: 'admin123',
        }

        const res = await request(app).post('/api/v1/users/login').send(data)
        expect(res.statusCode).toEqual(401)
        expect(res.body.status).toBe('NOT_FOUND')
        expect(res.body.error).toBeDefined()
        expect(res.body.error).toBe(`User with email ${data.email} not found!`)
    })
    it('should send response with a 401 status code because wrong password', async () => {
        const data = {
            email: 'admin6@gmail.com',
            password: 'admin12',
        }
        const res = await request(app).post('/api/v1/users/login').send(data)
        expect(res.statusCode).toEqual(401)
        expect(res.body.status).toBe('NOT_FOUND')
        expect(res.body.error).toBeDefined()
        expect(res.body.error).toBe('Incorrect password!')
    })
})

describe('PUT /api/v1/users/ Test update feature user', () => {
    beforeEach(async () => {
        const registerUser = await request(app)
            .post('/api/v1/users/register')
            .send(UserData)

        const login = await request(app).post('/api/v1/users/login').send({
            email: 'admin@gmail.com',
            password: 'admin123',
        })

        token = login.body.data.token
        // console.log(token, '<< ini token')
    })
    it(`should send response with a 200 status code`, async () => {
        const res = await request(app)
            .put('/api/v1/users')
            .set('token', token)
            .send({
                fullName: 'adminupdate',
                email: 'fadhil@gmail.com',
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body.status).toBe('OK')
        expect(res.body.data).toBeDefined()
    })
    it(`should send response with a 401 status code because unaotorized`, async () => {
        const res = await request(app)
            .put('/api/v1/users')
            .set('token', '')
            .send({
                fullName: 'adminupdate',
                email: 'fadhil@gmail.com',
            })
        expect(res.statusCode).toEqual(401)
        expect(res.body.status).toBe('UNAUTOHORIZED')
        expect(res.body.error).toBeDefined()
    })
})

describe('PATCH /api/v1/users/topup Test for topup feature user', () => {
    beforeEach(async () => {
        const registerUser = await request(app)
            .post('/api/v1/users/register')
            .send(UserData)

        const login = await request(app).post('/api/v1/users/login').send({
            email: 'admin@gmail.com',
            password: 'admin123',
        })

        token = login.body.data.token
        // console.log(token, '<< ini token')
    })
    it(`should send response with a 200 status code`, async () => {
        const res = await request(app)
            .patch('/api/v1/users/topup')
            .set('token', token)
            .send({
                balance: '30000',
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body.status).toBe('OK')
        expect(res.body.data).toBeDefined()
    })
    it(`should send response with a 401 status code because unauthorized`, async () => {
        const res = await request(app)
            .patch('/api/v1/users/topup')
            .set('token', '')
            .send({
                balance: '30000',
            })
        expect(res.statusCode).toEqual(401)
        expect(res.body.status).toBe('UNAUTOHORIZED')
        expect(res.body.error).toBeDefined()
        expect(res.body.error).toBe('Token not provided!')
    })
})

describe('DELETE /api/v1/users/ Test for topup feature user', () => {
    beforeEach(async () => {
        const registerUser = await request(app)
            .post('/api/v1/users/register')
            .send(UserData)

        const login = await request(app).post('/api/v1/users/login').send({
            email: 'admin@gmail.com',
            password: 'admin123',
        })

        token = login.body.data.token
        // console.log(token, '<< ini token')
    })
    it(`should send response with a 401 status code because unauthorized`, async () => {
        const res = await request(app).delete('/api/v1/users/').set('token', '')
        expect(res.statusCode).toEqual(401)
        expect(res.body.status).toBe('UNAUTOHORIZED')
        expect(res.body.error).toBeDefined()
        expect(res.body.error).toBe('Token not provided!')
    })

    it(`should send response with a 200 status code`, async () => {
        const res = await request(app)
            .delete('/api/v1/users/')
            .set('token', token)
        expect(res.statusCode).toEqual(200)
        expect(res.body.status).toBe('OK')
        expect(res.body.data).toBeDefined()
        expect(res.body.data).toBe(
            'Your account has been successfully deleted!'
        )
    })
})

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete('Users', null, {})
})
