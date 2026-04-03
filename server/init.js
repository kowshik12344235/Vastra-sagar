import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDB() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL not found in .env');
    return;
  }

  console.log('Connecting to TiDB Cloud (SSL Required)...');
  const connection = await mysql.createConnection({ 
    uri: connectionString,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
  });

  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim() !== '');

    console.log('Running schema initialization...');
    for (let statement of statements) {
      await connection.query(statement);
    }
    console.log('✅ Database tables created successfully on TiDB Cloud!');
  } catch (err) {
    console.error('❌ Error initializing database:', err);
  } finally {
    await connection.end();
  }
}

initDB();
