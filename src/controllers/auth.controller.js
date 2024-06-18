
const pool = require('../db');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const client = await pool.connect()
  try {
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
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
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
  }
};

module.exports = { registerUser, loginUser };
