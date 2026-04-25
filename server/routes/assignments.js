const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getCourseAssignments, getInstructorAssignments, getStudentAssignments,
  createAssignment, submitAssignment, gradeSubmission
} = require('../controllers/assignmentController');

router.get('/instructor', protect, authorize('instructor', 'admin'), getInstructorAssignments);
router.get('/student', protect, authorize('student'), getStudentAssignments);
router.get('/course/:courseId', protect, getCourseAssignments);
router.post('/', protect, authorize('instructor', 'admin'), createAssignment);
router.post('/:id/submit', protect, authorize('student'), submitAssignment);
router.put('/:id/grade/:studentId', protect, authorize('instructor', 'admin'), gradeSubmission);

module.exports = router;
