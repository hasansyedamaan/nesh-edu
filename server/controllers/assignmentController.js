const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

// @desc  Get assignments for a course
// @route GET /api/assignments/course/:courseId
exports.getCourseAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('course', 'title')
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get instructor's assignments
// @route GET /api/assignments/instructor
exports.getInstructorAssignments = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map(c => c._id);
    const assignments = await Assignment.find({ course: { $in: courseIds } })
      .populate('course', 'title')
      .populate('submissions.student', 'name email')
      .sort({ dueDate: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get student's assignments (enrolled courses)
// @route GET /api/assignments/student
exports.getStudentAssignments = async (req, res) => {
  try {
    const Enrollment = require('../models/Enrollment');
    const enrollments = await Enrollment.find({ student: req.user._id });
    const courseIds = enrollments.map(e => e.course.toString());
    const assignments = await Assignment.find({ course: { $in: courseIds } })
      .populate('course', 'title')
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create assignment
// @route POST /api/assignments
exports.createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Submit assignment
// @route POST /api/assignments/:id/submit
exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found.' });

    const alreadySubmitted = assignment.submissions.find(
      s => s.student.toString() === req.user._id.toString()
    );
    if (alreadySubmitted) {
      return res.status(400).json({ message: 'Already submitted.' });
    }

    assignment.submissions.push({
      student: req.user._id,
      content: req.body.content,
      fileUrl: req.body.fileUrl || null
    });
    await assignment.save();
    res.json({ message: 'Assignment submitted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Grade submission
// @route PUT /api/assignments/:id/grade/:studentId
exports.gradeSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found.' });

    const submission = assignment.submissions.find(
      s => s.student.toString() === req.params.studentId
    );
    if (!submission) return res.status(404).json({ message: 'Submission not found.' });

    submission.score = score;
    submission.feedback = feedback;
    submission.gradedAt = new Date();
    submission.gradedBy = req.user._id;

    await assignment.save();
    res.json({ message: 'Graded successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
