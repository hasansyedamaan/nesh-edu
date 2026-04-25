const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: null
  },
  videoFilename: {
    type: String,
    default: null
  },
  duration: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: false
  },
  resources: [
    {
      title: String,
      url: String,
      type: { type: String, enum: ['pdf', 'link', 'file'], default: 'link' }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', LessonSchema);
