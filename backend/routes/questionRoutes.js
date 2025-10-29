const express = require('express');
const router = express.Router();
const { authenticateJWT, requireAdmin } = require('../authMiddleware');
const questionController = require('../controllers/questionController');

// Get all questions in a quiz (authenticated users)
router.get('/:quizId', authenticateJWT, questionController.getQuestions);

// Create question (Admin only)
router.post('/:quizId', authenticateJWT, requireAdmin, questionController.createQuestion);

// Update question (Admin only)
router.put('/:quizId/:questionId', authenticateJWT, requireAdmin, questionController.updateQuestion);

// Delete question (Admin only)
router.delete('/:quizId/:questionId', authenticateJWT, requireAdmin, questionController.deleteQuestion);

module.exports = router;
