const { Transactionhistory, Product, Category, Users } = require('../models')

class transactionHistoryController {
    static async buyProduct(req, res) {
        try {
            const { productId, quantity } = req.body
            const userId = req.userData.id
            // console.log(userId, '<< Id user')
            const parseQuantity = parseInt(quantity)

            const product = await Product.findOne({
                where: {
                    id: productId,
                },
            })

            if (!product) {
                return res.status(401).json({
                    code: 401,
                    status: 'NOT_FOUND',
                    error: 'Product not found!',
                })
            }

            // console.log(product, '<< ini product')

            const user = await Users.findOne({
                where: {
                    id: userId,
                },
            })

            // console.log(user, '<< ini data user')

            const category = await Category.findOne({
                where: {
                    id: product.categoryId,
                },
            })

            // console.log(category.sold_product_amount, '<< INI CATEGORY')

            if (product.stock >= parseQuantity) {
                const totalPrice = parseQuantity * product.price
                if (user.balance >= totalPrice) {
                    const transactionHistory = await Transactionhistory.create({
                        quantity,
                        totalPrice,
                        productId,
                        userId,
                    })

                    product.stock = product.stock - parseQuantity
                    await product.save()

                    user.balance = user.balance - totalPrice
                    await user.save()

                    category.sold_product_amount =
                        parseInt(category.sold_product_amount) + parseQuantity
                    await category.save()

                    return res.status(201).json({
                        code: 201,
                        status: 'CREATED',
                        data: transactionHistory,
                    })
                } else {
                    return res.status(422).json({
                        code: 422,
                        status: 'UNPROCESSABLE_CONTENT',
                        error: 'Insufficient user balance!',
                    })
                }
            } else {
                if (!product) {
                    return res.status(401).json({
                        code: 401,
                        status: 'NOT_FOUND',
                        error: 'Product not found!',
                    })
                }
                return res.status(422).json({
                    code: 422,
                    status: 'UNPROCESSABLE_CONTENT',
                    error: 'Insufficient product stock!',
                })
            }
        } catch (e) {
            // console.log(e)
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

    static async getTransactionByAdmin(req, res) {
        try {
            const transaction = await Transactionhistory.findAll({
                include: [
                    {
                        model: Product,
                        atributes: [
                            'id',
                            'title',
                            'price',
                            'stock',
                            'categoryId',
                        ],
                    },
                    {
                        model: Users,
                        atributes: ['id', 'email', 'balance', 'gender', 'role'],
                    },
                ],
            })

            const response = transaction.map((transaction) => {
                return {
                    ProductId: transaction.productId,
                    UserId: transaction.userId,
                    quantity: transaction.quantity,
                    totalPrice: transaction.totalPrice,
                    product: {
                        id: transaction.Product.id,
                        title: transaction.Product.title,
                        price: transaction.Product.price,
                        stock: transaction.Product.stock,
                        CategoryId: transaction.Product.categoryId,
                    },
                    user: {
                        id: transaction.User.id,
                        email: transaction.User.email,
                        balance: transaction.User.balance,
                        gender: transaction.User.gender,
                        role: transaction.User.role,
                    },
                }
            })

            return res.status(200).json({
                code: 200,
                status: 'OK',
                data: response,
            })
        } catch (e) {
            res.status(e?.code || 500).json(e)
        }
    }

    static async getTransactionByUser(req, res) {
        try {
            const { transactionId } = req.params

            const transactions = await Transactionhistory.findAll({
                where: {
                    id: transactionId,
                },
                include: {
                    model: Product,
                },
            })

            // console.log(transactions)

            if (!transactions) {
                return res.status(401).json({
                    code: 401,
                    status: 'NOT_FOUND',
                    error: 'Product not found!',
                })
            }

            const response = transactions.map((transaction) => {
                return {
                    ProductId: transaction.productId,
                    UserId: transaction.userId,
                    quantity: transaction.quantity,
                    totalPrice: transaction.totalPrice,
                    product: {
                        id: transaction.Product.id,
                        title: transaction.Product.title,
                        price: transaction.Product.price,
                        stock: transaction.Product.stock,
                        CategoryId: transaction.Product.categoryId,
                    },
                }
            })

            return res.status(200).json({
                code: 200,
                status: 'OK',
                data: response,
            })
        } catch (e) {
            res.status(e?.code || 500).json(e)
        }
    }
}

module.exports = transactionHistoryController
