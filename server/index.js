require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://neshedu.com',
    'https://www.neshedu.com',
    'https://nesh-edu.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/users', require('./routes/users'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/assignments', require('./routes/assignments'));

// Seed endpoint (for initial setup only)
app.get('/api/seed', async (req, res) => {
  try {
    const User = require('./models/User');
    const Course = require('./models/Course');
    const Module = require('./models/Module');
    const Lesson = require('./models/Lesson');
    const Enrollment = require('./models/Enrollment');
    
    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Lesson.deleteMany({});
    await Enrollment.deleteMany({});
    
    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@neshedu.com',
      password: 'admin123',
      role: 'admin',
      bio: 'Platform administrator'
    });
    
    // Create instructor
    const instructor = await User.create({
      name: 'Dr. Sarah Chen',
      email: 'instructor@neshedu.com',
      password: 'instructor123',
      role: 'instructor',
      bio: 'Expert in neural networks and AI'
    });
    
    // Create student
    const student = await User.create({
      name: 'John Doe',
      email: 'student@neshedu.com',
      password: 'student123',
      role: 'student'
    });
    
    // Create course
    const course = await Course.create({
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
      shortDescription: 'Build modern websites from scratch',
      instructor: instructor._id,
      category: 'Web Development',
      level: 'Beginner',
      price: 0,
      tags: ['html', 'css', 'javascript', 'web'],
      isPublished: true,
      enrollmentCount: 1,
      rating: { average: 4.5, count: 10 }
    });
    
    // Create module
    const module1 = await Module.create({
      title: 'Getting Started with HTML',
      course: course._id,
      order: 0,
      description: 'Learn the basics of HTML'
    });
    
    // Create lessons
    await Lesson.create([
      { title: 'What is HTML?', module: module1._id, course: course._id, content: '# What is HTML?\n\nHTML stands for HyperText Markup Language...', order: 0, isFree: true, duration: 10 },
      { title: 'HTML Elements and Tags', module: module1._id, course: course._id, content: '# Elements and Tags\n\nLearn about HTML elements...', order: 1, duration: 15 },
      { title: 'Creating Your First Page', module: module1._id, course: course._id, content: '# Your First Page\n\nLet\'s create a simple page...', order: 2, duration: 20 }
    ]);
    
    // Create enrollment
    await Enrollment.create({
      student: student._id,
      course: course._id,
      progress: 33,
      completedLessons: [],
      lastAccessedLesson: null
    });
    
    res.json({ message: 'Database seeded successfully!', 
      users: { admin: 'admin@neshedu.com / admin123', instructor: 'instructor@neshedu.com / instructor123', student: 'student@neshedu.com / student123' }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'NESH API running', timestamp: new Date() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ status: 'NESHEDU API running', message: 'Welcome to NESHEDU Educational Society' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 NESH Server running on port ${PORT}`);
});
