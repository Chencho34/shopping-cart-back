const { Router } = require('express')
const { getUsers } = require('../controllers/users.controller')
const { registerUser, loginUser } = require('../controllers/auth.controller')

const router = Router()
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', (req, res) => {
  res.send('<h1>holas</h1>')
})
router.get('/users', getUsers)

module.exports = router
