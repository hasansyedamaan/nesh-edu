# NESH - New Age EdTech Platform

A full-stack MERN educational platform designed for delivering online courses with a modern, serene learning experience.

## Overview

NESH is an advanced edtech platform built around the concept of "Cognitive Clarity" — a serene, high-end sanctuary for digital learning. The platform enables instructors to create and manage courses while providing students with an immersive learning environment.

## Tech Stack

- **Frontend**: React 19, Vite, React Router, GSAP (animations), Axios
- **Backend**: Express.js, MongoDB/Mongoose, JWT Authentication
- **Database**: MongoDB (local or Atlas)
- **File Uploads**: Multer

## Features

### Authentication & Authorization
- JWT-based authentication with role-based access control (RBAC)
- Three user roles: `admin`, `instructor`, `student`
- Secure password hashing with bcryptjs

### Course Management
- Create, update, delete courses (instructor/admin only)
- Course modules and lessons hierarchy
- Video and content upload support
- Course publishing workflow

### Student Experience
- Course enrollment and progress tracking
- Lesson completion tracking
- Access to free/premium lessons

### Admin Dashboard
- Platform-wide user management
- Course oversight and control

## Architecture

```
nesh_new/
├── client/                 # React frontend (Vite, port 5173)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   └── utils/
│   └── vite.config.js      # Proxy config for API
├── server/                 # Express backend (port 5000)
│   ├── config/db.js        # MongoDB connection
│   ├── controllers/        # Route logic
│   ├── middleware/        # Auth, file upload
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── uploads/           # Static file storage
│   ├── utils/             # Utilities
│   └── index.js           # Entry point
└── package.json           # Root scripts
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local instance or MongoDB Atlas)

### Installation

```bash
# Install all dependencies
npm run install-all

# Or manually:
npm install
cd server && npm install
cd ../client && npm install
```

### Configuration

Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/nesh
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
```

### Running the Application

```bash
# Run both client and server
npm run dev

# Run server only (port 5000)
npm run server

# Run client only (port 5173)
npm run client
```

### Seeding the Database

Visit `http://localhost:5000/api/seed` or run:
```bash
npm run seed
```

**Seed Credentials:**
| Role   | Email                    | Password     |
|--------|-------------------------|--------------|
| Admin  | admin@neshedu.com       | admin123     |
| Instructor | instructor@neshedu.com | instructor123 |
| Student | student@neshedu.com   | student123   |

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Courses (`/api/courses`)
- `GET /api/courses` - List all courses
- `GET /api/courses/mine` - My courses (instructor/admin)
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (instructor/admin)
- `PUT /api/courses/:id` - Update course (instructor/admin)
- `DELETE /api/courses/:id` - Delete course (instructor/admin)
- `PUT /api/courses/:id/publish` - Publish/unpublish course

### Modules & Lessons
- `POST /api/courses/:id/modules` - Add module
- `POST /api/courses/:courseId/modules/:moduleId/lessons` - Add lesson
- `GET /api/courses/:courseId/lessons/:lessonId` - Get lesson
- `PUT /api/courses/:courseId/lessons/:lessonId` - Update lesson
- `DELETE /api/courses/:courseId/lessons/:lessonId` - Delete lesson

### Users (`/api/users`)
- `GET /api/users` - List users (admin)
- `GET /api/users/:id` - Get user
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Enrollments (`/api/enrollments`)
- `GET /api/enrollments` - List enrollments
- `GET /api/enrollments/my` - My enrollments
- `POST /api/enrollments` - Enroll in course
- `PUT /api/enrollments/:id` - Update progress

### Assignments (`/api/assignments`)
- `GET /api/assignments` - List assignments
- `POST /api/assignments` - Create assignment (instructor)
- `PUT /api/assignments/:id` - Update assignment

## Database Models

### User
- name, email, password, role (admin|instructor|student)
- avatar, bio, isActive, lastLogin, timestamps

### Course
- title, description, shortDescription
- instructor (ref), category, level, price
- tags, thumbnail, isPublished
- enrollmentCount, rating (average, count)
- timestamps

### Module
- title, description, course (ref), order

### Lesson
- title, content, module (ref), course (ref)
- video, order, isFree, duration
- timestamps

### Enrollment
- student (ref), course (ref), progress
- completedLessons[], lastAccessedLesson, timestamps

### Assignment
- title, description, course (ref), dueDate
- timestamps

## Design System

The platform uses a custom design system centered on "Cognitive Clarity":

- **Colors**: Mint (#98DBC6) for primary, Lavender for secondary
- **Typography**: Manrope font family
- **Effects**: Glassmorphism with backdrop blur
- **Spacing**: 8px rhythmic scale

See `design/DESIGN.md` for complete design tokens.

## Client Routes (React Router)

- `/` - Landing/Home
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Student dashboard
- `/courses` - Course catalog
- `/courses/:id` - Course details
- `/learn/:courseId/:lessonId` - Lesson player
- `/instructor` - Instructor dashboard
- `/admin` - Admin dashboard

## Notes

- Client uses ES modules (`"type": "module"`)
- Server uses CommonJS
- Static uploads served from `server/uploads` at `/uploads`
- Client proxies `/api` and `/uploads` to `http://localhost:5000`
- CORS configured for localhost:5173, localhost:3000, and production domains