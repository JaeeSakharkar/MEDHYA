const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  subjectId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
chapterSchema.index({ subjectId: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('Chapter', chapterSchema);