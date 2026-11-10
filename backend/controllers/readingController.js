const pool = require('../config/db');

const addReading = async (req, res) => {
    try {
        const { reading_date, slot, value } = req.body;

        // Check required fields
        if (!reading_date || !slot || value === undefined) {
            return res.status(400).json({
                message: 'Date, slot and glucose value are required'
            });
        }

        
if (!Number.isInteger(Number(value)) || Number(value) < 40 || Number(value) > 600) {
    return res.status(400).json({
        message: 'Glucose value must be an integer between 40 and 600'
    });
}

const allowedSlots = [
    'Morning',
    'After breakfast',
    'After lunch',
    'After dinner'
];

if (!allowedSlots.includes(slot)) {
    return res.status(400).json({
        message: 'Invalid reading slot'
    });
}

const today = new Date().toISOString().split('T')[0];

if (reading_date > today) {
    return res.status(400).json({
        message: 'Reading date cannot be in the future'
    });
}

const existingReading = await pool.query(
    `SELECT id FROM readings
     WHERE user_id = $1
     AND reading_date = $2
     AND slot = $3`,
    [req.user.id, reading_date, slot]
);

if (existingReading.rows.length > 0) {
    return res.status(409).json({
        message: 'You already have a reading for this slot on this date'
    });
}


const result = await pool.query(
    `INSERT INTO readings
    (user_id, reading_date, slot, value)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [req.user.id, reading_date, slot, Number(value)]
);

return res.status(201).json({
    message: 'Glucose reading added successfully',
    reading: result.rows[0]
});



    } catch (error) {
        console.error('Add reading error:', error.message);

        return res.status(500).json({
            message: 'Server error while adding reading'
        });
    }
};


const getReadings = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM readings
             WHERE user_id = $1
             ORDER BY reading_date DESC, created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({
            message: 'Readings fetched successfully',
            readings: result.rows
        });

    } catch (error) {
        console.error('Get readings error:', error.message);

        return res.status(500).json({
            message: 'Server error while fetching readings'
        });
    }
};


const updateReading = async (req, res) => {
    try {
        const { id } = req.params;
        const { reading_date, slot, value } = req.body;

        // Check required fields
        if (!reading_date || !slot || value === undefined) {
            return res.status(400).json({
                message: 'Date, slot and glucose value are required'
            });
        }

        // Validate glucose value
        if (
            !Number.isInteger(Number(value)) ||
            Number(value) < 40 ||
            Number(value) > 600
        ) {
            return res.status(400).json({
                message: 'Glucose value must be an integer between 40 and 600'
            });
        }

        // Validate slot
        const allowedSlots = [
            'Morning',
            'After breakfast',
            'After lunch',
            'After dinner'
        ];

        if (!allowedSlots.includes(slot)) {
            return res.status(400).json({
                message: 'Invalid reading slot'
            });
        }

        // Validate date
        const today = new Date().toISOString().split('T')[0];

        if (reading_date > today) {
            return res.status(400).json({
                message: 'Reading date cannot be in the future'
            });
        }

        // Update only the logged-in user's reading
        const result = await pool.query(
            `UPDATE readings
             SET reading_date = $1,
                 slot = $2,
                 value = $3,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4 AND user_id = $5
             RETURNING *`,
            [
                reading_date,
                slot,
                Number(value),
                id,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Reading not found'
            });
        }

        return res.status(200).json({
            message: 'Reading updated successfully',
            reading: result.rows[0]
        });

    } catch (error) {
        console.error('Update reading error:', error.message);

        if (error.code === '23505') {
            return res.status(409).json({
                message: 'A reading already exists for this slot and date'
            });
        }

        return res.status(500).json({
            message: 'Server error while updating reading'
        });
    }
};

const deleteReading = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM readings
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Reading not found'
            });
        }

        return res.status(200).json({
            message: 'Reading deleted successfully'
        });

    } catch (error) {
        console.error('Delete reading error:', error.message);

        return res.status(500).json({
            message: 'Server error while deleting reading'
        });
    }
};

module.exports = {
    addReading,
    getReadings,
    updateReading,
    deleteReading
};




module.exports = { addReading,getReadings, updateReading , deleteReading };
