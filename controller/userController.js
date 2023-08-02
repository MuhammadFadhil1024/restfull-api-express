const { Users } = require('../models')
const { comparePassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')

class UserController {
    static async register(req, res) {
        try {
            const { fullName, password, gender, email } = req.body
            const data = await Users.create({
                fullName,
                email,
                password,
                gender,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            const response = {
                id: data.id,
                fullName: data.fullName,
                email: data.email,
                gender: data.gender,
                balance: new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                }).format(data.balance),
            }

            res.status(201).json({
                code: 201,
                status: 'CREATED',
                data: response,
            })
        } catch (e) {
            if (
                e.name === 'SequelizeValidationError' ||
                e.name === 'SequelizeUniqueConstraintError'
            ) {
                const validationError = {}
                // eslint-disable-next-line array-callback-return
                e.errors.map((er) => {
                    validationError[er.path] = er.message
                })
                return res.status(400).json({
                    code: 400,
                    status: 'BAD_REQUEST',
                    error: validationError,
                })
            } else {
                res.status(e?.code || 500).json(e)
            }
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(422).json({
                    code: 422,
                    status: 'UNPROCESSABLE_CONTENT',
                    error: "Email or password can't be empty!",
                })
            }

            const user = await Users.findOne({
                where: {
                    email: email,
                },
            })

            if (!user) {
                return res.status(404).json({
                    code: 404,
                    status: 'NOT_FOUND',
                    error: `User with email ${email} not found!`,
                })
            }

            const correctPassword = comparePassword(password, user.password)
            if (!correctPassword) {
                return res.status(401).json({
                    code: 401,
                    status: 'NOT_FOUND',
                    error: 'Incorrect password!',
                })
            }

            const payload = {
                id: user.id,
                email: user.email,
                role: user.role,
            }
            const token = generateToken(payload)
            return res.status(200).json({
                code: 200,
                status: 'OK',
                data: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    token: token,
                },
            })
        } catch (e) {
            if (
                e.name === 'SequelizeValidationError' ||
                e.name === 'SequelizeUniqueConstraintError'
            ) {
                const validasiErorr = {}
                e.errors.map((er) => {
                    validasiErorr[er.path] = er.message
                })
                return res.status(400).json({ error: validasiErorr })
            } else {
                res.status(e?.code || 500).json(e)
            }
        }
    }

    static async updateUser(req, res) {
        try {
            const { fullName, email } = req.body

            // console.log(req.userData)

            const user = await Users.update(
                {
                    fullName,
                    email,
                },
                {
                    where: {
                        id: req.userData.id,
                    },
                    individualHooks: true,
                    returning: true,
                }
            )

            const response = {
                email: user[1][0].email,
                fullName: user[1][0].fullName,
            }

            res.status(200).json({
                code: 200,
                status: 'OK',
                response: response,
            })
        } catch (e) {
            if (
                e.name === 'SequelizeValidationError' ||
                e.name === 'SequelizeUniqueConstraintError'
            ) {
                const validasiErorr = {}
                e.errors.map((er) => {
                    validasiErorr[er.path] = er.message
                })
                return res.status(400).json({ error: validasiErorr })
            } else {
                res.status(e?.code || 500).json(e)
            }
        }
    }

    static async deleteUser(req, res) {
        try {
            const user = await Users.destroy({
                where: {
                    id: req.userData.id,
                },
            })

            if (!user) {
                return res.status(401).json({
                    code: 401,
                    status: 'NOT_FOUND',
                    error: 'User not Found!',
                })
            }

            res.status(200).json({
                code: 200,
                status: 'OK',
                data: 'Your account has been successfully deleted!',
            })
        } catch (e) {
            if (
                e.name === 'SequelizeValidationError' ||
                e.name === 'SequelizeUniqueConstraintError'
            ) {
                const validasiErorr = {}
                e.errors.map((er) => {
                    validasiErorr[er.path] = er.message
                })
                return res.status(400).json({ error: validasiErorr })
            } else {
                res.status(e?.code || 500).json(e)
            }
        }
    }

    static async topUp(req, res) {
        try {
            const { balance } = req.body

            const user = await Users.findOne({
                where: {
                    id: req.userData.id,
                },
            })
            user.balance += parseInt(balance)
            await user.save()

            const response = {
                name: user.fullName,
                email: user.email,
                balance: new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                }).format(user.balance),
            }

            res.status(200).json({
                code: 200,
                status: 'OK',
                data: response,
            })
        } catch (e) {
            if (
                e.name === 'SequelizeValidationError' ||
                e.name === 'SequelizeUniqueConstraintError'
            ) {
                const validasiErorr = {}
                e.errors.map((er) => {
                    validasiErorr[er.path] = er.message
                })
                return res.status(400).json({ error: validasiErorr })
            } else {
                res.status(e?.code || 500).json(e)
            }
        }
    }
}

module.exports = UserController
