// Handles quiz endpoints logic
const quizModel = require('../models/quizModel');

/**
 * Get all quizzes.
 */
async function getAllQuizzes(req, res) {
  try {
    const quizzes = await quizModel.listQuizzes();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve quizzes.' });
  }
}

/**
 * Get quiz by id.
 */
async function getQuizById(req, res) {
  try {
    const { id } = req.params;
    const quiz = await quizModel.getQuiz(id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve quiz.' });
  }
}

/**
 * Create a new quiz.
 */
async function createQuiz(req, res) {
  try {
    const quiz = req.body;
    const result = await quizModel.createQuiz(quiz);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create quiz.' });
  }
}

/**
 * Update quiz.
 */
async function updateQuiz(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = await quizModel.updateQuiz(id, updates);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quiz.' });
  }
}

/**
 * Delete quiz.
 */
async function deleteQuiz(req, res) {
  try {
    const { id } = req.params;
    await quizModel.deleteQuiz(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete quiz.' });
  }
}

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz
};
