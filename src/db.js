const { Pool } = require('pg')
// const { db } = require('.env')

const pool = new Pool({
  user: 'postgres',
  password: 'root',
  host: 'localhost',
  port: 5432,
  database: 'shopping_cart'
})

// DB_USER = postgres
// DB_PASSWORD = root
// DB_HOST = localhost
// DB_PORT = 5432
// DB_DATABASE = shopping_cart

module.exports = pool