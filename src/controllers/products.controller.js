const pool = require('../db')

const getAllProducts = async (req, res, next) => {
  try {
    const allProducts = await pool.query('SELECT * FROM products')
    res.json(allProducts.rows)
  } catch (error) {
    next(error)
  }
}

const getProduct = async (req, res, next) => {
  const { id } = req.params
  const client = await pool.connect()

  try {
    const product = await client.query('SELECT * FROM products WHERE id = $1', [id])
    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'producto no encontrado.' })
    }
    res.json(product.rows)
  } catch (error) {
    next(error)
  } finally {
    client.release()
  }
}

const createProduct = async (req, res, next) => {
  try {
    // Validación de entrada
    const { title, img, description, price, quantity, total } = req.body
    if (!title || !img || !description || !price || !quantity || !total) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' })
    }

    // Realización de la consulta SQL utilizando una transacción
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const result = await client.query('INSERT INTO products(title, img, description, price, quantity, total) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [title, img, description, price, quantity, total])
      await client.query('COMMIT')
      res.status(201).json(result.rows[0]) // Devolver el producto creado con el código 201 (Created)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error // Pasar el error al siguiente middleware de manejo de errores
    } finally {
      client.release() // Liberar el cliente de la pool de conexiones
    }
  } catch (error) {
    next(error) // Pasar el error al siguiente middleware de manejo de errores
  }
}

module.exports = {
  getAllProducts,
  createProduct,
  getProduct
}
