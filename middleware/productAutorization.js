const { Category } = require('../models')

class productAutorization {
    static async chekCategoryId(req, res, next) {
        try {
            const { categoryId } = req.body

            if (categoryId === '' || categoryId === undefined) {
                res.status(422).json({
                    code: 422,
                    status: 'UNPROCESSABLE_CONTENT',
                    error: 'categoryId cannt be null!',
                })
            } else {
                const category = await Category.findOne({
                    where: {
                        id: categoryId,
                    },
                })

                return category
                    ? next()
                    : res.status(401).json({
                          code: 401,
                          status: 'NOT_FOUND',
                          error: 'Category not found!',
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

module.exports = productAutorization
