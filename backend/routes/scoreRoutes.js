const express = require('express');
const router = express.Router();
const { authenticateJWT, requireAdmin } = require('../authMiddleware');
const scoreController = require('../controllers/scoreController');

// Get current user's scores
router.get('/', authenticateJWT, scoreController.getScores);

// Submit a quiz score
router.post('/', authenticateJWT, scoreController.submitScore);

// Get all scores (Admin only)
router.get('/all', authenticateJWT, requireAdmin, scoreController.getAllScores);

// Get scores for specific quiz (Admin only)
router.get('/:quizId', authenticateJWT, requireAdmin, scoreController.getScoresForQuiz);

module.exports = router;
