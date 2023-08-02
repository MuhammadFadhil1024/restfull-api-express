const router = require('express').Router()
const productController = require('../controller/productController')
const authentication = require('../middleware/authentication')
const adminAuthorization = require('../middleware/adminAuthorization')
const productAutorization = require('../middleware/productAutorization')

router.use(authentication)
router.post(
    '/',
    adminAuthorization.isAdmin,
    productAutorization.chekCategoryId,
    productController.addProduct
)
router.get('/', adminAuthorization.isAdmin, productController.getProduct)
router.put(
    '/:productId',
    adminAuthorization.isAdmin,
    productController.updateProduct
)
router.patch(
    '/:productId',
    adminAuthorization.isAdmin,
    productAutorization.chekCategoryId,
    productController.updateCategoryId
)

router.delete(
    '/:productId',
    adminAuthorization.isAdmin,
    productController.deleteProduct
)

module.exports = router
