import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection Pool
let pool;

const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is missing! Please set it in Vercel Environment Variables.');
    return;
  }
  try {
    if (!pool) {
      pool = mysql.createPool({ 
        uri: process.env.DATABASE_URL,
        ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
        waitForConnections: true,
        connectionLimit: 1, // Serverless should use low connection limit
        queueLimit: 0
      });
      console.log('✅ Connected to MySQL via pool');
    }
    return pool;
  } catch (err) {
    console.error('❌ MySQL Connection Error:', err.message);
  }
};

// API Routes
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const db = await connectDB();
    if (!db) return res.status(503).json({ success: false, message: 'Database not connected' });
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
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
    const db = await connectDB();
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    const [rows] = await db.query('SELECT * FROM sales ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sales', async (req, res) => {
  const { id, name, category, quantity, costPrice, sellingPrice, profit, date, customerName, paymentMode } = req.body;
  try {
    const db = await connectDB();
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    await db.query(
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
    const db = await connectDB();
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    await db.query('DELETE FROM sales WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', async (req, res) => {
  const db = await connectDB();
  res.json({ status: 'ok', database: db ? 'connected' : 'connecting' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Local server running on port ${PORT}`);
  });
}

export default app;
