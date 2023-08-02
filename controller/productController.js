const { Product } = require('../models')

class productController {
    static async addProduct(req, res) {
        try {
            const { title, price, stock, categoryId } = req.body

            const product = await Product.create({
                title,
                price,
                stock,
                categoryId,
            })

            res.status(201).json({
                code: 201,
                status: 'CREATED',
                data: product,
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

    static async getProduct(req, res) {
        try {
            const products = await Product.findAll()

            return res.status(200).json({
                code: 200,
                status: 'OK',
                data: products,
            })
        } catch (e) {
            res.status(e?.code || 500).json(e)
        }
    }

    static async updateProduct(req, res) {
        try {
            const { productId } = req.params

            const { price, stock, title } = req.body

            const product = await Product.findOne({
                where: {
                    id: productId,
                },
            })

            if (!product) {
                return res.status(404).json({
                    code: 404,
                    status: 'NOT_FOUND',
                    error: 'Product not found!',
                })
            }

            product.price = price
            product.stock = stock
            product.title = title
            await product.save()

            return res.status(200).json({
                code: 200,
                status: 'OK',
                data: product,
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

    static async updateCategoryId(req, res) {
        try {
            const { categoryId } = req.body
            const { productId } = req.params

            const product = await Product.findOne({
                where: {
                    id: productId,
                },
            })

            if (!product) {
                return res.status(404).json({
                    code: 404,
                    status: 'NOT_FOUND',
                    error: 'Product not found!',
                })
            }

            product.categoryId = categoryId
            await product.save()

            return res.status(200).json({
                code: 200,
                status: 'OK',
                data: product,
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

    static async deleteProduct(req, res) {
        try {
            const { productId } = req.params

            const product = await Product.destroy({
                where: {
                    id: productId,
                },
            })

            if (!product) {
                if (!product) {
                    return res.status(404).json({
                        code: 404,
                        status: 'NOT_FOUND',
                        error: 'Product not found!',
                    })
                }
            }

            res.status(200).json({
                code: 200,
                status: 'OK',
                data: 'Product has been successfully deleted!',
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

module.exports = productController
