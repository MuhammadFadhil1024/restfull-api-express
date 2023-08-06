const app = require('../server')
const request = require('supertest')
const { sequelize } = require('../models')
const authentication = require('../middleware/authentication')

const UserData = {
    fullName: 'fadhil',
    email: 'admin@gmail.com',
    password: 'admin123',
    gender: 'male',
}

describe('Test for middleware authentication', () => {
    let token

    const mockUser = {
        email: 'admin@gmail.com',
        role: 'customer',
    }

    beforeEach(async () => {
        await request(app).post('/api/v1/users/register').send(UserData)

        const login = await request(app).post('/api/v1/users/login').send({
            email: 'admin@gmail.com',
            password: 'admin123',
        })

        token = login.body.data.token
    })

    it('should succes to next request', async () => {
        const req = {
            headers: {
                token: token,
            },
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        const next = jest.fn()
        await authentication(req, res, next)
        expect(next).toHaveBeenCalled()
        expect(req.userData).toBeDefined()
        expect(req.userData.email).toEqual(mockUser.email)
        expect(req.userData.role).toEqual(mockUser.role)
    })

    it('should failed to next request because unauthorized', async () => {
        const req = {
            headers: {
                token: '',
            },
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        const next = jest.fn()
        await authentication(req, res, next)
        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(401)
    })
})

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete('Users', null, {})
})
