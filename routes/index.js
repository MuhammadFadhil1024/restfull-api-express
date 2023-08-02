const router = require('express').Router()
const userRoute = require('./user')
const categoryRoute = require('./category')
const productRoute = require('./product')
const transactionHistoryRoute = require('./transactionHistory')

router.use('/api/v1/users', userRoute)
router.use('/api/v1/categories', categoryRoute)
router.use('/api/v1/products', productRoute)
router.use('/api/v1/transactions', transactionHistoryRoute)

module.exports = router
