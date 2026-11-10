const express = require('express');

const {
    getDailyReport,
    getMonthToDateReport,
    getPreviousMonthReport
} = require('../controllers/reportController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Daily report
router.get('/daily', protect, getDailyReport);

// Current month report
router.get('/month-to-date', protect, getMonthToDateReport);

// Previous month report
router.get('/previous-month', protect, getPreviousMonthReport);

module.exports = router;