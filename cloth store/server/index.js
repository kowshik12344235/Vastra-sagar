import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database Connection
let pool;

const connectDB = async () => {
  try {
    pool = mysql.createPool(process.env.DATABASE_URL);
    console.log('Connected to MySQL via pool');
  } catch (err) {
    console.error('MySQL Connection Error:', err);
    process.exit(1);
  }
};

connectDB();

// API Routes
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
      res.json({ success: true, user: { id: rows[0].id, username: rows[0].username } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/sales', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sales ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sales', async (req, res) => {
  const { id, name, category, quantity, costPrice, sellingPrice, profit, date, customerName, paymentMode } = req.body;
  try {
    await pool.query(
      'INSERT INTO sales (id, name, category, quantity, costPrice, sellingPrice, profit, date, customerName, paymentMode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, category, quantity, costPrice, sellingPrice, profit, date, customerName, paymentMode]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/sales/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM sales WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
