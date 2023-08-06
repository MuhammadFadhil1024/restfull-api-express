const { generateToken, compareToken } = require('../helpers/jwt')

describe('Test for function jwt authentication', () => {
    const payload = {
        fullName: 'fadhil',
        email: 'admin@gmail.com',
        role: 'customer',
    }

    it('should generate new token', () => {
        const token = generateToken(payload)
        expect(typeof token).toBe('string')
        // toBetruthy to ensure the value is true
        expect(typeof token).toBeTruthy()
    })

    it('should decode token', () => {
        const token = generateToken(payload)
        const decode = compareToken(token)
        // to chech decode token have property payload
        expect(decode).toEqual(expect.objectContaining(payload))
        expect(decode.email).toBeDefined()
    })
})
