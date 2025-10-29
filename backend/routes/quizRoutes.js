const express = require('express');
const router = express.Router();
const auth = require('../authMiddleware');
const quizController = require('../controllers/quizController');

// Get all quizzes
router.get('/', auth, quizController.getAllQuizzes);

// Get a specific quiz
router.get('/:id', auth, quizController.getQuizById);

// Create a quiz (Admin only)
router.post('/', auth, quizController.createQuiz);

// Update a quiz (Admin only)
router.put('/:id', auth, quizController.updateQuiz);

// Delete a quiz (Admin only)
router.delete('/:id', auth, quizController.deleteQuiz);

module.exports = router;
