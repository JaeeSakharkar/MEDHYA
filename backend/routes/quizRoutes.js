const express = require('express');
const router = express.Router();
const { authenticateJWT, requireAdmin } = require('../authMiddleware');
const quizController = require('../controllers/quizController');

// Get all quizzes (authenticated users)
router.get('/', authenticateJWT, quizController.getAllQuizzes);

// Get a specific quiz (authenticated users)
router.get('/:id', authenticateJWT, quizController.getQuizById);

// Create a quiz (Admin only)
router.post('/', authenticateJWT, requireAdmin, quizController.createQuiz);

// Update a quiz (Admin only)
router.put('/:id', authenticateJWT, requireAdmin, quizController.updateQuiz);

// Delete a quiz (Admin only)
router.delete('/:id', authenticateJWT, requireAdmin, quizController.deleteQuiz);

module.exports = router;
