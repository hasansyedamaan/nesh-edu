const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  enrollCourse, getMyEnrollments, getCourseEnrollment,
  completeLesson, getCourseStudents
} = require('../controllers/enrollmentController');

router.post('/', protect, authorize('student'), enrollCourse);
router.get('/my', protect, getMyEnrollments);
router.get('/course/:courseId', protect, getCourseEnrollment);
router.put('/complete-lesson', protect, authorize('student'), completeLesson);
router.get('/course/:courseId/students', protect, authorize('instructor', 'admin'), getCourseStudents);

module.exports = router;
