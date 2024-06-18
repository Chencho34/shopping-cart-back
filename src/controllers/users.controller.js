const pool = require('../db')

const getUsers = async (req, res, next) => {
  try {
    const allProducts = await pool.query('SELECT * FROM users')
    res.json(allProducts.rows)
  } catch (error) {
    next(error)
  }
}

const createUser = async (req, res, next) => {
  try {

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }
    const client = await pool.connect()
    try {
      await client.query("BEGIN");
      const result = await client.query('INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *', [name, email, password]);
      await client.query("COMMIT");
      res.status(201).json(result.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error; // Pasar el error al siguiente middleware de manejo de errores
    } finally {
      client.release()
    }
  } catch (error) {
    next(error)

  }

}

module.exports = {
  getUsers,
  createUser
}