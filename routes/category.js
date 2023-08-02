const router = require('express').Router()
const categoryController = require('../controller/categoryController')
const authentication = require('../middleware/authentication')
const adminAuthorization = require('../middleware/adminAuthorization')

router.use(authentication)
router.post('/', adminAuthorization.isAdmin, categoryController.addCategory)
router.get('/', adminAuthorization.isAdmin, categoryController.getCategory)
router.patch(
    '/:categoryId',
    adminAuthorization.isAdmin,
    categoryController.updateType
)
router.delete(
    '/:categoryId',
    adminAuthorization.isAdmin,
    categoryController.deleteCategory
)

module.exports = router
