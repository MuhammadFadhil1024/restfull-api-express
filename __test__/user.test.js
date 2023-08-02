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

describe('POST /api/v1/users/register', () => {
    it('should send response with a 201 status code', async () => {
        const res = await request(app)
            .post('/api/v1/users/register')
            .send(UserData)
        expect(res.statusCode).toEqual(201)
        expect(res.body.status).toBe('CREATED')
        expect(res.body.data).toBeDefined()
        // expect(res.body).toHaveProperty('id')
        // expect(res.body).toHaveProperty('fullMame')
        // expect(res.body).toHaveProperty('email')
        // expect(res.body).toHaveProperty('username')
        // userIdx = res.body.id
        // console.log(userIdx,'<< id ke dua')
    })
    // it('should return 500 status code if the email is already registered', async () => {
    //     const res = await request(app).post('/users/register').send(UserData)
    //     expect(res.statusCode).toEqual(500)
    //     expect(typeof res.body).toEqual('object')
    //     expect(res.body).toHaveProperty('error')
    //     expect(typeof res.body.error.email).toEqual('string')
    //     expect(res.body.error.email).toEqual('Email already use!')
    // })
})

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete('Users', null, {})
})
