const express = require('express');
const router = express.Router();
const auth = require('../authMiddleware');
const questionController = require('../controllers/questionController');

// Get all questions in a quiz
router.get('/:quizId', auth, questionController.getQuestions);

// Create question
router.post('/:quizId', auth, questionController.createQuestion);

// Update question
router.put('/:quizId/:questionId', auth, questionController.updateQuestion);

// Delete question
router.delete('/:quizId/:questionId', auth, questionController.deleteQuestion);

module.exports = router;
