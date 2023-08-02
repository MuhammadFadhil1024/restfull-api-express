const router = require('express').Router()
const user = require('../controller/userController')
const authentication = require('../middleware/authentication')

router.post('/register', user.register)
router.post('/login', user.login)
router.use(authentication)
router.put('/', user.updateUser)
router.delete('/', user.deleteUser)
router.patch('/topup', user.topUp)

module.exports = router
