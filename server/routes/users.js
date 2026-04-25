const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers, getUser, getInstructors, updateUserRole, deleteUser,
  getInstructorStats, getAdminStats
} = require('../controllers/userController');

router.get('/instructors', getInstructors);
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/instructor/stats', protect, authorize('instructor', 'admin'), getInstructorStats);
router.get('/admin/stats', protect, authorize('admin'), getAdminStats);
router.get('/:id', protect, authorize('admin'), getUser);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
