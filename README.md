
# Sweety – Blood Glucose Tracker

Sweety is a full-stack blood glucose tracking application built with JavaScript. It allows users to create an account, securely log in, record and manage glucose readings, and view reports for different time periods.

## Features

### Authentication
- User registration and login
- Secure password hashing using bcryptjs
- JWT-based authentication
- Protected dashboard and API routes

### Glucose Reading Management
- Add blood glucose readings
- View readings for a selected date
- Edit existing readings
- Delete readings
- Four daily time slots:
  - Morning
  - After breakfast
  - After lunch
  - After dinner
- Validate glucose values between 40 and 600 mg/dL
- Prevent duplicate readings for the same user, date, and time slot

### Reports
- Daily glucose report
- Month-to-date report
- Previous-month report
- Highest, lowest, and average readings
- Total reading count and reading history

### User Interface
- Responsive React interface
- Tailwind CSS styling
- Healthcare-inspired teal colour theme
- Dashboard with reading management and reports

## Technologies Used

| Area | Technology |
|---|---|
| Frontend | React, JavaScript |
| Styling | Tailwind CSS |
| Build tool | Vite |
| Routing | React Router |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Authentication | JSON Web Tokens |
| Password hashing | bcryptjs |

## Project Structure

```text
sweety-blood-glucose-tracker/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   │   └── schema.sql
│   ├── middleware/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Prerequisites

Install the following software:

- Node.js and npm
- PostgreSQL
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd sweety-blood-glucose-tracker
```

### 2. Create the PostgreSQL database

Open PostgreSQL or pgAdmin and execute:

```sql
CREATE DATABASE sweety;
```

Connect to the `sweety` database and execute the SQL statements in:

```text
backend/database/schema.sql
```

### 3. Configure the backend

Open a terminal:

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder using `.env.example` as a template.

Configure the following environment variables:

```env
PORT=5000

DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=sweety
DB_PASSWORD=your_postgres_password
DB_PORT=5432

JWT_SECRET=your_secure_random_secret
```

Use your own local PostgreSQL credentials and a secure JWT secret.

### 4. Start the backend

For development:

```bash
npm run dev
```

For normal execution:

```bash
npm start
```

The backend runs at:

```text
http://localhost:5000
```

### 5. Configure and start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

## API Documentation

All API endpoints are prefixed with:

```text
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Authenticate a user |

### Glucose Reading Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/readings` | Add a glucose reading |
| GET | `/readings` | Retrieve user readings |
| PUT | `/readings/:id` | Update a reading |
| DELETE | `/readings/:id` | Delete a reading |

### Report Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/reports/daily?date=YYYY-MM-DD` | Retrieve a daily report |
| GET | `/reports/month-to-date` | Retrieve the current month's report |
| GET | `/reports/previous-month` | Retrieve the previous month's report |

### Authentication

Protected endpoints require a valid JWT access token in the request header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Database Design

### Users Table

Stores registered user information.

- `id` – Primary key
- `name` – User's name
- `email` – Unique email address
- `password` – Hashed password
- `created_at` – Account creation timestamp

### Readings Table

Stores blood glucose readings associated with users.

- `id` – Primary key
- `user_id` – Foreign key referencing users
- `reading_date` – Date of the reading
- `slot` – Daily time slot
- `value` – Glucose value in mg/dL
- `created_at` – Record creation timestamp
- `updated_at` – Record update timestamp

Database constraints ensure valid glucose values, allowed time slots, and unique readings per user, date, and time slot.

## Security

- Passwords are hashed using bcryptjs.
- JWT authentication protects private API endpoints.
- Reading operations are restricted to the authenticated user.
- Environment variables store sensitive configuration.
- The `.env` file must not be committed to version control.

## Running the Application

The backend and frontend must both be running for the application to work.

1. Start PostgreSQL.
2. Start the backend server.
3. Start the React frontend.
4. Register a new account or log in.
5. Add and manage glucose readings.
6. View glucose reports.

## Author

Developed as a Junior Full Stack Developer take-home assignment.
