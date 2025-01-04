const pool = require('../db')

const getAllProducts = async (req, res, next) => {
  try {
    const allProducts = await pool.query('SELECT * FROM products')
    res.json(allProducts.rows)
  } catch (error) {
    next(error)
  }
}

const deleteProduct = async (req, res) => {
  const { id } = req.params
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const result = await client.query('DELETE FROM products WHERE id = $1', [id])

    if (result.rowCount === 0) {
      await client.query('ROLLBACK')
      return res.status(400).json({ error: 'Product no encontrado.' })
    }

    await client.query('COMMIT')

    return res.json({ message: 'Eliminado correctamente' })
  } catch (error) {
    await client.query('ROLLBACK')
    console.log(error.stack)
    return res.status(500).json({ message: 'Internal server error' })
  } finally {
    client.release()
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
    const { title, price, img, description, quantity, category, discount } = req.body
    if (!title || !img || !description || !price || !category || !discount) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' })
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const result = await client.query('INSERT INTO products(title, img, description, price, quantity, category, discount) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [title, img, description, price, quantity, category, discount])
      await client.query('COMMIT')

      const product = result.rows[0]

      res.status(201).json({ message: 'Product created succesfully', product })
    } catch (error) {
      await client.query('ROLLBACK')
      console.log(error)

      res.status(500).json({ error: 'Error creating product' })
    } finally {
      client.release()
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  deleteProduct
}
