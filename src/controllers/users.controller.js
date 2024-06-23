const pool = require('../db')

const getUsers = async (req, res, next) => {
  const client = await pool.connect()

  try {
    const users = await client.query('SELECT * FROM users')
    res.json(users.rows)
  } catch (error) {
    next(error)
  } finally {
    client.release()
  }
}

const getUser = async (req, res, next) => {
  const { name } = req.params
  const client = await pool.connect()

  try {
    const user = await client.query('SELECT * FROM users WHERE name = $1', [name])
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' })
    }
    res.json(user.rows)
  } catch (error) {
    next(error)
  } finally {
    client.release()
  }
}

const deleteUser = async (req, res) => {
  const { name } = req.body
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const result = await client.query('DELETE FROM users WHERE name = $1', [name])

    if (result.rowCount === 0) {
      await client.query('ROLLBACK')
      return res.status(400).json({ error: 'Username no encontrado.' })
    }

    await client.query('COMMIT')

    return res.json({ message: 'Eliminado correctamente' })
  } catch (error) {
    await client.query('ROLLBACK')
    console.log(error.stack)
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    client.release()
  }
}

module.exports = {
  getUsers,
  deleteUser,
  getUser
}
