require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🌱 Connected to MongoDB for seeding...');

  // Clear existing data
  await User.deleteMany({});
  await Course.deleteMany({});
  await Module.deleteMany({});
  await Lesson.deleteMany({});
  await Enrollment.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create users
  const admin = await User.create({
    name: 'Alex Admin',
    email: 'admin@nesh.io',
    password: 'nesh1234',
    role: 'admin',
    bio: 'Platform administrator for NESH Cognitive Systems.'
  });

  const instructor1 = await User.create({
    name: 'Dr. Sarah Chen',
    email: 'instructor@nesh.io',
    password: 'nesh1234',
    role: 'instructor',
    bio: 'Expert in neural networks and AI integrations with 10+ years of experience.'
  });

  const instructor2 = await User.create({
    name: 'Marcus Webb',
    email: 'marcus@nesh.io',
    password: 'nesh1234',
    role: 'instructor',
    bio: 'System security and algorithmic thinking specialist.'
  });

  const student1 = await User.create({
    name: 'Jordan Lee',
    email: 'student@nesh.io',
    password: 'nesh1234',
    role: 'student',
    bio: 'Aspiring full-stack developer navigating the NESH ecosystem.'
  });

  const student2 = await User.create({
    name: 'Priya Sharma',
    email: 'priya@nesh.io',
    password: 'nesh1234',
    role: 'student'
  });

  console.log('👥 Users created');

  // Create courses
  const course1 = await Course.create({
    title: 'Core Logic: Data Structures & Algorithms',
    description: 'Master the fundamental structures for advanced data processing and algorithmic thinking. This comprehensive course covers arrays, linked lists, trees, graphs, sorting, and searching algorithms with real-world applications.',
    shortDescription: 'Fundamental structures for advanced data processing and algorithmic thinking.',
    instructor: instructor1._id,
    category: 'Core Logic',
    level: 'Beginner',
    price: 0,
    tags: ['algorithms', 'data structures', 'programming', 'computer science'],
    isPublished: true,
    enrollmentCount: 2,
    rating: { average: 4.8, count: 156 }
  });

  const course2 = await Course.create({
    title: 'Neural Nets: Deep Learning Architecture',
    description: 'Master the architecture of interconnected learning systems and AI integrations. Dive deep into neural network design, backpropagation, CNNs, RNNs, and transformers.',
    shortDescription: 'Master the architecture of interconnected learning systems and AI integrations.',
    instructor: instructor1._id,
    category: 'Neural Nets',
    level: 'Advanced',
    price: 49.99,
    tags: ['AI', 'machine learning', 'deep learning', 'neural networks'],
    isPublished: true,
    enrollmentCount: 1,
    rating: { average: 4.9, count: 203 }
  });

  const course3 = await Course.create({
    title: 'System Integrity: Cybersecurity Fundamentals',
    description: 'Advanced protocols for maintaining secure, high-integrity educational nodes. Learn ethical hacking, penetration testing, network security, and defensive security strategies.',
    shortDescription: 'Advanced protocols for maintaining secure, high-integrity educational nodes.',
    instructor: instructor2._id,
    category: 'System Integrity',
    level: 'Intermediate',
    price: 29.99,
    tags: ['security', 'cybersecurity', 'hacking', 'networking'],
    isPublished: true,
    enrollmentCount: 0,
    rating: { average: 4.7, count: 89 }
  });

  const course4 = await Course.create({
    title: 'Synthesis: Full-Stack Mastery',
    description: 'The final layer where all disciplines converge into mastery of digital realms. Build complete web applications integrating frontend, backend, databases, and deployment.',
    shortDescription: 'The final layer where all disciplines converge into mastery of digital realms.',
    instructor: instructor2._id,
    category: 'Synthesis',
    level: 'Advanced',
    price: 59.99,
    tags: ['full-stack', 'web development', 'MERN', 'React', 'Node.js'],
    isPublished: true,
    enrollmentCount: 0,
    rating: { average: 4.6, count: 74 }
  });

  console.log('📚 Courses created');

  // Create modules for course1
  const module1 = await Module.create({ title: 'Introduction to Algorithms', course: course1._id, order: 0, description: 'Foundation concepts and Big-O notation.' });
  const module2 = await Module.create({ title: 'Data Structures Deep Dive', course: course1._id, order: 1, description: 'Arrays, linked lists, stacks, and queues.' });
  const module3 = await Module.create({ title: 'Trees & Graphs', course: course1._id, order: 2, description: 'Binary trees, BSTs, and graph algorithms.' });

  // Create lessons for module1
  const lesson1 = await Lesson.create({ title: 'What are Algorithms?', module: module1._id, course: course1._id, content: '# What are Algorithms?\n\nAn algorithm is a step-by-step procedure for solving a problem...', order: 0, isFree: true, duration: 12 });
  const lesson2 = await Lesson.create({ title: 'Big-O Notation Explained', module: module1._id, course: course1._id, content: '# Big-O Notation\n\nBig-O notation describes the upper bound of time complexity...', order: 1, duration: 18 });
  const lesson3 = await Lesson.create({ title: 'Space vs Time Complexity', module: module1._id, course: course1._id, content: '# Space vs Time Complexity\n\nWe often trade space for time or vice versa...', order: 2, duration: 15 });

  // Create lessons for module2
  const lesson4 = await Lesson.create({ title: 'Arrays & Dynamic Arrays', module: module2._id, course: course1._id, content: '# Arrays\n\nArrays are contiguous blocks of memory...', order: 0, duration: 22 });
  const lesson5 = await Lesson.create({ title: 'Linked Lists Mastery', module: module2._id, course: course1._id, content: '# Linked Lists\n\nA linked list is a linear data structure...', order: 1, duration: 25 });

  // Create modules/lessons for course2
  const module4 = await Module.create({ title: 'Perceptrons & Activation', course: course2._id, order: 0 });
  const lesson6 = await Lesson.create({ title: 'The Perceptron Model', module: module4._id, course: course2._id, content: '# Perceptron\n\nThe perceptron is the building block of neural networks...', order: 0, isFree: true, duration: 20 });
  const lesson7 = await Lesson.create({ title: 'Activation Functions', module: module4._id, course: course2._id, content: '# Activation Functions\n\nActivation functions introduce non-linearity...', order: 1, duration: 17 });

  console.log('📖 Modules and lessons created');

  // Enroll students
  await Enrollment.create({ student: student1._id, course: course1._id, progress: 60, completedLessons: [lesson1._id, lesson2._id, lesson3._id], lastAccessedLesson: lesson4._id });
  await Enrollment.create({ student: student1._id, course: course2._id, progress: 30, completedLessons: [lesson6._id], lastAccessedLesson: lesson7._id });
  await Enrollment.create({ student: student2._id, course: course1._id, progress: 20, completedLessons: [lesson1._id], lastAccessedLesson: lesson2._id });

  console.log('✅ Enrollments created');
  console.log('\n🎉 Seed complete! Test credentials:');
  console.log('   Admin:      admin@nesh.io      / nesh1234');
  console.log('   Instructor: instructor@nesh.io  / nesh1234');
  console.log('   Student:    student@nesh.io     / nesh1234');

  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
