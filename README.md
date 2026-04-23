# Student Grievance Management System

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application for managing student grievances in a college environment.

## Features

- **Student Authentication** — Register & Login with JWT + bcrypt
- **Grievance Management** — Submit, view, edit, delete grievances
- **Search** — Search grievances by title
- **Categories** — Academic, Hostel, Transport, Other
- **Status Tracking** — Pending / Resolved
- **Protected Routes** — Dashboard only accessible to logged-in users
- **Premium Dark UI** — Glassmorphism, animations, responsive design

## Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React + Vite                  |
| Backend   | Node.js + Express.js          |
| Database  | MongoDB + Mongoose            |
| Auth      | JWT + bcrypt                  |
| Styling   | Vanilla CSS (dark theme)      |

## API Endpoints

### Auth
| Method | Endpoint          | Description        |
|--------|-------------------|-------------------|
| POST   | `/api/register`   | Register student  |
| POST   | `/api/login`      | Login student     |

### Grievances (Protected)
| Method | Endpoint                         | Description             |
|--------|----------------------------------|------------------------|
| POST   | `/api/grievances`                | Submit grievance       |
| GET    | `/api/grievances`                | Get all grievances     |
| GET    | `/api/grievances/search?title=`  | Search by title        |
| GET    | `/api/grievances/:id`            | Get grievance by ID    |
| PUT    | `/api/grievances/:id`            | Update grievance       |
| DELETE | `/api/grievances/:id`            | Delete grievance       |

## Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
npm install
# Create .env file with:
# PORT=5001
# MONGO_URI=mongodb://localhost:27017/student_grievance_db
# JWT_SECRET=your_secret_key
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to the backend.

## MongoDB Schema

### Student
- `name` — String (required)
- `email` — String (required, unique)
- `password` — String (required, hashed)

### Grievance
- `title` — String (required)
- `description` — String (required)
- `category` — Enum: Academic | Hostel | Transport | Other
- `date` — Date (default: now)
- `status` — Enum: Pending | Resolved (default: Pending)
- `student` — ObjectId ref → Student

## Deployment

- **GitHub**: Push to repository
- **Render (Backend)**: Deploy as Web Service with env vars
- **Render (Frontend)**: Deploy as Static Site with build command `npm run build`
