const express = require('express');
const router = express.Router();

const {
    addReading,
    getReadings,
    updateReading,
    deleteReading
} = require('../controllers/readingController');

const { protect } = require('../middleware/authMiddleware');

// Add reading
router.post('/', protect, addReading);

// Get all readings
router.get('/', protect, getReadings);

// Update reading
router.put('/:id', protect, updateReading);

// Delete reading
router.delete('/:id', protect, deleteReading);

module.exports = router;