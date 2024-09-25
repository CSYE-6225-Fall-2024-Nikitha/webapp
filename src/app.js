const express = require('express');
const app = express();
const healthRoutes = require('./routes/healthRoutes');
require('dotenv').config();

app.use(express.json());
app.use('/', healthRoutes);

// error handler
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err);
    res.status(500).send(); 
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 