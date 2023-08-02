const router = require('express').Router()
const transactionHistoryController = require('../controller/transactionHistoryController')
const adminAuthorization = require('../middleware/adminAuthorization')
const transactionHistoriesAutorization = require('../middleware/transactionHistoriesAuthorization')
const authentication = require('../middleware/authentication')

router.use(authentication)
router.post('/', transactionHistoryController.buyProduct)
router.get(
    '/admin',
    adminAuthorization.isAdmin,
    transactionHistoryController.getTransactionByAdmin
)
router.get(
    '/:transactionId',
    transactionHistoriesAutorization.checkUser,
    transactionHistoryController.getTransactionByUser
)

module.exports = router
