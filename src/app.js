const express = require('express');
const app = express();
const { Pool } = require('pg');
require('dotenv').config();

// Database connection setup
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ax: 10, 
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,  
});

app.use(express.json());
// Health check endpoint
app.get('/healthz', async (req, res) => {
  if (Object.keys(req.query).length > 0) {

    return res.status(400).send(); // Respond with 400 Bad Request if there are query parameters
}
// Check if there are any query parameters
if (Object.keys(req.query).length > 0) {
  return res.status(400).send(); // Respond with 400 Bad Request if there are query parameters
}

// Check for body in GET requests
if (req.headers['content-length'] > 0) {
  return res.status(400).send(); // Respond with 400 Bad Request if there's a payload in GET
}

    try {
        // Check database connection
        await pool.query('SELECT NOW()');
        res.set('Cache-Control', 'no-cache');
        return res.status(200).send(); // No body in the response
    } catch (error) {
        console.error('Database connection error:', error);
        res.set('Cache-Control', 'no-cache');
        return res.status(503).send(); // No body in the response
    }
});

// Handle unsupported methods for the /healthz endpoint
app.all('/healthz', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    return res.status(405).send(); // Method Not Allowed, no body in the response
});

// General error handler
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err);
    res.status(500).send(); // No body in the response
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
