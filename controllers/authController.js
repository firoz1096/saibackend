require('dotenv').config();
const pool = require("../db/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email',
      [name, email, hashedPassword]
    );
    res.json({ message: 'User registered', user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') { // duplicate email
      return res.status(400).json({ error: 'User already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (userResult.rows.length === 0)
      return res.status(400).json({ error: 'Invalid credentials' });

    const hashedPassword = userResult.rows[0].password;
    if (!hashedPassword) return res.status(500).json({ error: 'Password not found for user' });

    const validPassword = await bcrypt.compare(password, hashedPassword);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: userResult.rows[0].id, email: userResult.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

// Protected route
exports.dashboard = (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}! This is a protected page.` });
};
