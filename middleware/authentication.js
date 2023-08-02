const { Users } = require('../models')
const { compareToken } = require('../helpers/jwt')

const authentication = async (req, res, next) => {
    try {
        const { token } = req.headers

        if (!token) {
            return res.status(401).json({
                code: 401,
                status: 'UNAUTOHORIZED',
                error: 'Token not provided!',
            })
        }

        const decode = compareToken(token)

        const user = await Users.findOne({
            where: {
                email: decode.email,
            },
        })

        if (!user) {
            return res.status(404).json({
                code: '404',
                status: 'NOT_FOUND',
                error: 'User not found!',
            })
        }

        req.userData = {
            id: user.id,
            email: user.email,
            role: user.role,
        }

        next()
    } catch (e) {
        return res.status(500).json({
            code: 500,
            status: 'INTERNAL_SERVER_ERROR',
            error: e,
        })
    }
}

module.exports = authentication
