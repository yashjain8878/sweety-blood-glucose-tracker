
-- ==========================================
-- SWEETY - BLOOD GLUCOSE TRACKER
-- PostgreSQL Database Schema
-- ==========================================

-- USERS TABLE

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- READINGS TABLE
CREATE TABLE IF NOT EXISTS readings (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    reading_date DATE NOT NULL,

    slot VARCHAR(30) NOT NULL,

    value INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_readings_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT check_glucose_value
        CHECK (value BETWEEN 40 AND 600),

    CONSTRAINT check_reading_slot
        CHECK (
            slot IN (
                'Morning',
                'After breakfast',
                'After lunch',
                'After dinner'
            )
        ),

    CONSTRAINT unique_user_reading
        UNIQUE (user_id, reading_date, slot)
);

-- INDEX FOR FASTER USER READING LOOKUPS
CREATE INDEX IF NOT EXISTS idx_readings_user_date
ON readings(user_id, reading_date);
