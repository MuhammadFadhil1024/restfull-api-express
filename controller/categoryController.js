const { Category, Product } = require('../models')

class categoryController {
    static async addCategory(req, res) {
        try {
            const { type } = req.body
            const category = await Category.create({
                type,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            res.status(201).json({
                code: 201,
                status: 'CREATED',
                data: category,
            })
        } catch (e) {
            // console.log(e)
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

    static async getCategory(req, res) {
        try {
            const categories = await Category.findAll({ include: Product })

            return res.status(200).json({
                code: 200,
                status: 'OK',
                data: categories,
            })
        } catch (e) {
            res.status(e?.code || 500).json(e)
        }
    }

    static async updateType(req, res) {
        try {
            const { type } = req.body
            const { categoryId } = req.params

            const category = await Category.findOne({
                where: {
                    id: categoryId,
                },
            })

            if (!category) {
                return res.status(404).json({
                    code: 404,
                    status: 'NOT_FOUND',
                    error: 'Category not found!',
                })
            }

            category.type = type
            await category.save()

            return res.status(200).json({
                code: 200,
                status: 'OK',
                data: category,
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

    static async deleteCategory(req, res) {
        try {
            const { categoryId } = req.params

            const category = await Category.destroy({
                where: {
                    id: categoryId,
                },
            })

            if (!category) {
                return res.status(401).json({
                    code: 401,
                    status: 'NOT_FOUND',
                    error: 'Category not Found!',
                })
            }

            return res.status(200).json({
                code: 200,
                status: 'OK',
                data: 'Category has been successfully deleted!',
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

module.exports = categoryController
