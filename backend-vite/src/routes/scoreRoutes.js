import express from 'express';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Mock score controller functions for now
const scoreController = {
  getScores: (req, res) => {
    res.json([]);
  },
  submitScore: (req, res) => {
    res.json({ success: true, id: Date.now().toString() });
  },
  getAllScores: (req, res) => {
    res.json([]);
  },
  getScoresForQuiz: (req, res) => {
    res.json([]);
  }
};

// Get current user's scores
router.get('/', authenticateJWT, scoreController.getScores);

// Submit a quiz score
router.post('/', authenticateJWT, scoreController.submitScore);

// Get all scores (Admin only)
router.get('/all', authenticateJWT, requireAdmin, scoreController.getAllScores);

// Get scores for specific quiz (Admin only)
router.get('/:quizId', authenticateJWT, requireAdmin, scoreController.getScoresForQuiz);

export default router;