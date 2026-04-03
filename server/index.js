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
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is missing! Please set it in Render Environment Variables.');
    return;
  }
  try {
    pool = mysql.createPool({ 
      uri: process.env.DATABASE_URL,
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log('✅ Connected to MySQL via pool');
  } catch (err) {
    console.error('❌ MySQL Connection Error:', err.message);
  }
};

// API Routes
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!pool) return res.status(503).json({ success: false, message: 'Database not connected' });
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
    if (!pool) return res.status(503).json({ error: 'Database not connected' });
    const [rows] = await pool.query('SELECT * FROM sales ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sales', async (req, res) => {
  const { id, name, category, quantity, costPrice, sellingPrice, profit, date, customerName, paymentMode } = req.body;
  try {
    if (!pool) return res.status(503).json({ error: 'Database not connected' });
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
    if (!pool) return res.status(503).json({ error: 'Database not connected' });
    await pool.query('DELETE FROM sales WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: pool ? 'connected' : 'connecting' });
});

// Serve frontend files
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Handle React routing, return all requests to React app
app.get('(.*)', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server - ON RENDER, LISTENING ON 0.0.0.0 IS ESSENTIAL
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT} at 0.0.0.0`);
  connectDB();
});
