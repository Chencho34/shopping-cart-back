const pool = require('../db')

const getUsers = async (req, res, next) => {
  const client = await pool.connect()

  try {
    const users = await client.query('SELECT * FROM users')

    if (users.command === 0) {
      return res.status(404).json({
        succes: false,
        message: 'No users found'
      })
    }

    return res.status(200).json(users.rows)
  } catch (error) {
    next(error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
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
      return res.status(404).json({ error: `User ${name} not found` })
    }

    return res.status(200).json(user.rows[0])
  } catch (error) {
    next(error)
    return res.status(500).json({ message: 'Internal server error' })
  } finally {
    client.release()
  }
}

const deleteUser = async (req, res) => {
  const { name } = req.params
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
    return res.status(500).json({ message: 'Internal server error' })
  } finally {
    client.release()
  }
}

module.exports = {
  getUsers,
  deleteUser,
  getUser
}
