const { Router } = require('express')
const { getUsers, deleteUser, getUser } = require('../controllers/users.controller')
const { registerUser, loginUser } = require('../controllers/auth.controller')
const { getAllProducts, getProduct } = require('../controllers/products.controller')

const router = Router()

//*  Auth routes
router.post('/register', registerUser)
router.post('/login', loginUser)
// router.post('/logout', logOut)

//* User routes
router.get('/users', getUsers)
router.get('/user/:name', getUser)
// router.delete('/users', deleteUser)
router.delete('/user/:name', deleteUser)

//* Products routes
router.get('/products', getAllProducts)
router.get('/product/:id', getProduct)

module.exports = router
