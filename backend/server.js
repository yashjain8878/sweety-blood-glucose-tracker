
const express = require('express');
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 5000;

// Read JSON data from requests
app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Sweety Backend is running!');
});

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(`Database connected! Time: ${result.rows[0].now}`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Database connection failed');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
