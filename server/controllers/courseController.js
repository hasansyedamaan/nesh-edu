const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

// @desc  Get all published courses
// @route GET /api/courses
exports.getCourses = async (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) query.title = { $regex: search, $options: 'i' };

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ courses, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get instructor's courses
// @route GET /api/courses/mine
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single course with modules/lessons
// @route GET /api/courses/:id
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio');
    if (!course) return res.status(404).json({ message: 'Course not found.' });

    const modules = await Module.find({ course: course._id }).sort({ order: 1 });
    const moduleIds = modules.map(m => m._id);
    const lessons = await Lesson.find({ module: { $in: moduleIds } }).sort({ order: 1 });

    const modulesWithLessons = modules.map(mod => ({
      ...mod.toObject(),
      lessons: lessons.filter(l => l.module.toString() === mod._id.toString())
    }));

    res.json({ ...course.toObject(), modules: modulesWithLessons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create course
// @route POST /api/courses
exports.createCourse = async (req, res) => {
  try {
    const { title, description, shortDescription, category, level, price, tags } = req.body;
    const courseData = {
      title, description, shortDescription, category,
      level, price: price || 0,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      instructor: req.user._id
    };

    if (req.file) {
      courseData.thumbnail = `/uploads/thumbnails/${req.file.filename}`;
    }

    const course = await Course.create(courseData);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update course
// @route PUT /api/courses/:id
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found.' });

    const isOwner = course.instructor.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const updates = { ...req.body };
    if (req.file) updates.thumbnail = `/uploads/thumbnails/${req.file.filename}`;
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(t => t.trim());
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('instructor', 'name avatar');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete course
// @route DELETE /api/courses/:id
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found.' });

    const isOwner = course.instructor.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await Course.findByIdAndDelete(req.params.id);
    await Module.deleteMany({ course: req.params.id });
    await Lesson.deleteMany({ course: req.params.id });
    res.json({ message: 'Course deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Publish/Unpublish course
// @route PUT /api/courses/:id/publish
exports.togglePublish = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found.' });

    const isOwner = course.instructor.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    course.isPublished = !course.isPublished;
    await course.save();
    res.json({ isPublished: course.isPublished, message: course.isPublished ? 'Course published.' : 'Course unpublished.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add module to course
// @route POST /api/courses/:id/modules
exports.addModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found.' });

    const count = await Module.countDocuments({ course: course._id });
    const module = await Module.create({
      ...req.body,
      course: course._id,
      order: count
    });
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add lesson to module
// @route POST /api/courses/:courseId/modules/:moduleId/lessons
exports.addLesson = async (req, res) => {
  try {
    const count = await Lesson.countDocuments({ module: req.params.moduleId });
    const lessonData = {
      ...req.body,
      course: req.params.courseId,
      module: req.params.moduleId,
      order: count
    };

    if (req.file) {
      lessonData.videoUrl = `/uploads/videos/${req.file.filename}`;
      lessonData.videoFilename = req.file.filename;
    }

    const lesson = await Lesson.create(lessonData);
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get lesson (with enrollment check)
// @route GET /api/courses/:courseId/lessons/:lessonId
exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId).populate('module', 'title');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found.' });

    if (!lesson.isFree) {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: req.params.courseId
      });
      if (!enrollment) {
        return res.status(403).json({ message: 'Enroll in this course to access this lesson.' });
      }
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update lesson
// @route PUT /api/courses/:courseId/lessons/:lessonId
exports.updateLesson = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.videoUrl = `/uploads/videos/${req.file.filename}`;
      updates.videoFilename = req.file.filename;
    }
    const lesson = await Lesson.findByIdAndUpdate(req.params.lessonId, updates, { new: true });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete lesson
// @route DELETE /api/courses/:courseId/lessons/:lessonId
exports.deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.lessonId);
    res.json({ message: 'Lesson deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
