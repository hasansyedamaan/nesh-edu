const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getCourses, getMyCourses, getCourse, createCourse, updateCourse,
  deleteCourse, togglePublish, addModule, addLesson, getLesson,
  updateLesson, deleteLesson
} = require('../controllers/courseController');

router.get('/', getCourses);
router.get('/mine', protect, authorize('instructor', 'admin'), getMyCourses);
router.get('/:id', getCourse);
router.post('/', protect, authorize('instructor', 'admin'), upload.single('thumbnail'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), upload.single('thumbnail'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);
router.put('/:id/publish', protect, authorize('instructor', 'admin'), togglePublish);

// Module routes
router.post('/:id/modules', protect, authorize('instructor', 'admin'), addModule);

// Lesson routes
router.post('/:courseId/modules/:moduleId/lessons', protect, authorize('instructor', 'admin'), upload.single('video'), addLesson);
router.get('/:courseId/lessons/:lessonId', protect, getLesson);
router.put('/:courseId/lessons/:lessonId', protect, authorize('instructor', 'admin'), upload.single('video'), updateLesson);
router.delete('/:courseId/lessons/:lessonId', protect, authorize('instructor', 'admin'), deleteLesson);

module.exports = router;
