const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Module = require('../models/Module');

// @desc  Enroll in a course
// @route POST /api/enrollments
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return res.status(404).json({ message: 'Course not found or not published.' });
    }

    const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (existing) {
      return res.status(400).json({ message: 'Already enrolled in this course.' });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get student's enrollments
// @route GET /api/enrollments/my
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name avatar' }
      })
      .sort({ updatedAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get enrollment for specific course
// @route GET /api/enrollments/course/:courseId
exports.getCourseEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId
    });
    if (!enrollment) return res.status(404).json({ message: 'Not enrolled.' });
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Mark lesson as complete
// @route PUT /api/enrollments/complete-lesson
exports.completeLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });
    if (!enrollment) return res.status(404).json({ message: 'Not enrolled.' });

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    enrollment.lastAccessedLesson = lessonId;

    // Calculate progress
    const modules = await Module.find({ course: courseId });
    const moduleIds = modules.map(m => m._id);
    const totalLessons = await Lesson.countDocuments({ module: { $in: moduleIds } });
    enrollment.progress = totalLessons > 0
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;

    if (enrollment.progress === 100 && !enrollment.certificateIssued) {
      enrollment.certificateIssued = true;
      enrollment.certificateIssuedAt = new Date();
    }

    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get students enrolled in a course (instructor)
// @route GET /api/enrollments/course/:courseId/students
exports.getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found.' });

    const isOwner = course.instructor.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email avatar createdAt')
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
