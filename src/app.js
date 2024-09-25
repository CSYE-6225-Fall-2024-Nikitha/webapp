const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 8080;

// PostgreSQL Pool Configuration
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

// Health Check Route
app.get('/healthz', async (req, res) => {
  try {
    await pool.query('SELECT NOW()'); // Check the database connection
    res.set('Cache-Control', 'no-cache');
    res.status(200).send();
  } catch (err) {
    res.set('Cache-Control', 'no-cache');
    res.status(503).send();
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
