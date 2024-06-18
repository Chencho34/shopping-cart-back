const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const productsRoutes = require('./routes/products.routes')
const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use(productsRoutes)

app.use((err, req, res, next) => {
  return res.json({
    message: err.message
  })
})

app.listen(3000, () => {
  console.log('server in port 3000')
})

