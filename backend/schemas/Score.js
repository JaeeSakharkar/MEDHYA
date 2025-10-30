const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  quizId: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  attemptDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
scoreSchema.index({ userId: 1 });
scoreSchema.index({ quizId: 1 });
scoreSchema.index({ userId: 1, quizId: 1 });

module.exports = mongoose.model('Score', scoreSchema);