const { Router } = require('express')
const { getUsers, deleteUser, getUser } = require('../controllers/users.controller')
const { registerUser, loginUser } = require('../controllers/auth.controller')
const { getAllProducts } = require('../controllers/products.controller')

const router = Router()

//*  Auth routes
router.post('/register', registerUser)
router.post('/login', loginUser)
// router.post('/logout', logOut)

//* User routes
router.get('/users', getUsers)
router.get('/users/:name', getUser)
router.delete('/users', deleteUser)

//* Products routes
router.get('/products', getAllProducts)

module.exports = router
