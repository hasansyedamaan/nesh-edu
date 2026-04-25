const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc  Get all instructors
// @route GET /api/users/instructors
exports.getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' })
      .select('name email avatar bio');
    const instructorsWithStats = await Promise.all(
      instructors.map(async (inst) => {
        const courses = await Course.find({ instructor: inst._id, isPublished: true });
        const totalStudents = courses.reduce((a, c) => a + (c.enrollmentCount || 0), 0);
        return {
          ...inst.toObject(),
          totalCourses: courses.length,
          totalStudents
        };
      })
    );
    res.json(instructorsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all users (admin)
// @route GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.name = { $regex: search, $options: 'i' };

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single user
// @route GET /api/users/:id
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update user role (admin)
// @route PUT /api/users/:id/role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'instructor', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Deactivate/delete user (admin)
// @route DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deactivated successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get instructor stats
// @route GET /api/users/instructor/stats
exports.getInstructorStats = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map(c => c._id);
    const totalStudents = await Enrollment.countDocuments({ course: { $in: courseIds } });
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => c.isPublished).length;

    res.json({ totalCourses, publishedCourses, totalStudents, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get platform stats (admin)
// @route GET /api/users/admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const totalEnrollments = await Enrollment.countDocuments();

    res.json({
      totalUsers, totalStudents, totalInstructors,
      totalCourses, publishedCourses, totalEnrollments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
