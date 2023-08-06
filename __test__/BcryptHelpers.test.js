const { hashPassword, comparePassword } = require('../helpers/bcrypt')

let hash

beforeAll(() => {
    const password = 'LoremIpsum'
    const hashedPassword = hashPassword(password)
    hash = hashedPassword
})

describe('Test for bcrpt helpers', () => {
    const password = 'LoremIpsum'

    it('should return hash password', () => {
        expect(typeof hash).toBe('string')
    })

    it('should compare correctly password', () => {
        const checkPassword = comparePassword(password, hash)
        expect(checkPassword).toBe(true)
    })

    it('should return false for invalid hashed password', () => {
        const checkPassword = comparePassword(password, 'worng-Hash')
        expect(checkPassword).toBe(false)
    })

    it('should return false for invalid password', () => {
        const checkPassword = comparePassword('woring password', hash)
        expect(checkPassword).toBe(false)
    })
})
