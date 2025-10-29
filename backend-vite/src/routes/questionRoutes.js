import express from 'express';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Mock question controller functions for now
const questionController = {
  getQuestions: (req, res) => {
    res.json([
      { 
        id: '1', 
        quizId: req.params.quizId, 
        question: 'What is JavaScript?', 
        options: ['Programming language', 'Database', 'Operating system', 'Web browser'],
        correctAnswer: 0
      },
      { 
        id: '2', 
        quizId: req.params.quizId, 
        question: 'What does DOM stand for?', 
        options: ['Document Object Model', 'Data Object Management', 'Dynamic Object Method', 'Database Object Model'],
        correctAnswer: 0
      }
    ]);
  },
  createQuestion: (req, res) => {
    res.json({ success: true, id: Date.now().toString(), quizId: req.params.quizId, ...req.body });
  },
  updateQuestion: (req, res) => {
    res.json({ success: true, id: req.params.questionId, ...req.body });
  },
  deleteQuestion: (req, res) => {
    res.json({ success: true });
  }
};

// Get all questions in a quiz (authenticated users)
router.get('/:quizId', authenticateJWT, questionController.getQuestions);

// Create question (Admin only)
router.post('/:quizId', authenticateJWT, requireAdmin, questionController.createQuestion);

// Update question (Admin only)
router.put('/:quizId/:questionId', authenticateJWT, requireAdmin, questionController.updateQuestion);

// Delete question (Admin only)
router.delete('/:quizId/:questionId', authenticateJWT, requireAdmin, questionController.deleteQuestion);

export default router;