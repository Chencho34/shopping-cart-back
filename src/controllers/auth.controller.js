const pool = require('../db');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Contraseña almenos 8 caracteres.' })
  }

  const client = await pool.connect()

  try {
    const emailCheckResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    const nameCheckResult = await client.query('SELECT * FROM users WHERE name = $1', [name]);
    if (nameCheckResult.rows.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query("BEGIN");
    const result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, hashedPassword]);
    await client.query("COMMIT");

    const user = result.rows[0];

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release()
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }
  const client = await pool.connect()
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'El correo electrónico no está registrado.' });
    }

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release()
  }
};

module.exports = { registerUser, loginUser };
