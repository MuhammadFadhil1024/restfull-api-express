const { Transactionhistory } = require('../models')

class transactionHistoriesAutorization {
    static async checkUser(req, res, next) {
        try {
            const { transactionId } = req.params
            const userData = req.userData

            const transaction = await Transactionhistory.findOne({
                where: {
                    id: transactionId,
                },
            })

            if (transaction && transaction.userId == userData.id) {
                next()
            } else {
                if (!transaction) {
                    return res.status(401).json({
                        code: 401,
                        status: 'NOT_FOUND',
                        error: 'Transaction not found!',
                    })
                }
                res.status(403).json({
                    code: 403,
                    status: 'FROBIDDEN',
                    error: 'You dont have acces for this resource!',
                })
            }
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
}

module.exports = transactionHistoriesAutorization
