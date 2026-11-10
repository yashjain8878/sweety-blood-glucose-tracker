
const express = require('express');
const pool = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const readingRoutes = require('./routes/readingRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
    
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/reports', reportRoutes);

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
