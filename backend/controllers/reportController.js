const pool = require('../config/db');

const getDailyReport = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                message: 'Please provide a date'
            });
        }

        const summary = await pool.query(
            `SELECT
                MAX(value) AS highest,
                MIN(value) AS lowest,
                ROUND(AVG(value), 1) AS average,
                COUNT(*) AS total
             FROM readings
             WHERE user_id = $1
             AND reading_date = $2`,
            [req.user.id, date]
        );

        const readings = await pool.query(
            `SELECT id, reading_date, slot, value
             FROM readings
             WHERE user_id = $1
             AND reading_date = $2
             ORDER BY created_at ASC`,
            [req.user.id, date]
        );

        return res.status(200).json({
            message: 'Daily report fetched successfully',
            summary: summary.rows[0],
            readings: readings.rows
        });

    } catch (error) {
        console.error('Daily report error:', error.message);

        return res.status(500).json({
            message: 'Server error while fetching daily report'
        });
    }
};


const getMonthToDateReport = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                MAX(value) AS highest,
                MIN(value) AS lowest,
                ROUND(AVG(value), 1) AS average,
                COUNT(*) AS total
             FROM readings
             WHERE user_id = $1
             AND reading_date >= DATE_TRUNC('month', CURRENT_DATE)::DATE
             AND reading_date <= CURRENT_DATE`,
            [req.user.id]
        );

        const readings = await pool.query(
            `SELECT id, reading_date, slot, value
             FROM readings
             WHERE user_id = $1
             AND reading_date >= DATE_TRUNC('month', CURRENT_DATE)::DATE
             AND reading_date <= CURRENT_DATE
             ORDER BY reading_date DESC, created_at ASC`,
            [req.user.id]
        );

        return res.status(200).json({
            message: 'Month-to-date report fetched successfully',
            summary: result.rows[0],
            readings: readings.rows
        });

    } catch (error) {
        console.error('MTD report error:', error.message);

        return res.status(500).json({
            message: 'Server error while fetching month-to-date report'
        });
    }
};

const getPreviousMonthReport = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                MAX(value) AS highest,
                MIN(value) AS lowest,
                ROUND(AVG(value), 1) AS average,
                COUNT(*) AS total
            FROM readings
            WHERE user_id = $1
            AND reading_date >= (
                DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
            )::DATE
            AND reading_date < DATE_TRUNC('month', CURRENT_DATE)::DATE`,
            [req.user.id]
        );

        const readings = await pool.query(
            `SELECT id, reading_date, slot, value
            FROM readings
            WHERE user_id = $1
            AND reading_date >= (
                DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
            )::DATE
            AND reading_date < DATE_TRUNC('month', CURRENT_DATE)::DATE
            ORDER BY reading_date DESC, created_at ASC`,
            [req.user.id]
        );

        return res.status(200).json({
            message: 'Previous month report fetched successfully',
            summary: result.rows[0],
            readings: readings.rows
        });

    } catch (error) {
        console.error('Previous month report error:', error.message);

        return res.status(500).json({
            message: 'Server error while fetching previous month report'
        });
    }
};


module.exports = { getDailyReport, getMonthToDateReport, getPreviousMonthReport};
