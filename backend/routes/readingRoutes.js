
const express = require('express');
const { addReading } = require('../controllers/readingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Add a glucose reading (protected route)
router.post('/', protect, addReading);

module.exports = router;
