const { Router } = require('express')
const { getAllProducts, createProduct } = require('../controllers/products.controller')
const { getUsers, createUser } = require('../controllers/users.controller')

const router = Router()
router.get('/users', getUsers)
router.post('/users', createUser)

router.get('/products', getAllProducts)
// router.get('/product/:id', getProduct)
router.post('/products', createProduct)
// router.get('/products/:id', deleteProduct)
// router.get('/products/:id', updateProduct)

module.exports = router