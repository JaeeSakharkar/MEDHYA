// Handles quiz endpoints logic
import * as quizModel from '../models/quizModel.js';

/**
 * Get all quizzes.
 */
export async function getAllQuizzes(req, res) {
  try {
    const quizzes = await quizModel.listQuizzes();
    res.json(quizzes);
  } catch (err) {
    console.error('Get all quizzes error:', err);
    res.status(500).json({ error: 'Failed to retrieve quizzes.' });
  }
}

/**
 * Get quiz by id.
 */
export async function getQuizById(req, res) {
  try {
    const { id } = req.params;
    const quiz = await quizModel.getQuiz(id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });
    res.json(quiz);
  } catch (err) {
    console.error('Get quiz by ID error:', err);
    res.status(500).json({ error: 'Failed to retrieve quiz.' });
  }
}

/**
 * Create a new quiz.
 */
export async function createQuiz(req, res) {
  try {
    const quiz = req.body;
    const result = await quizModel.createQuiz(quiz);
    res.status(201).json(result);
  } catch (err) {
    console.error('Create quiz error:', err);
    res.status(500).json({ error: 'Failed to create quiz.' });
  }
}

/**
 * Update quiz.
 */
export async function updateQuiz(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = await quizModel.updateQuiz(id, updates);
    res.json(result);
  } catch (err) {
    console.error('Update quiz error:', err);
    res.status(500).json({ error: 'Failed to update quiz.' });
  }
}

/**
 * Delete quiz.
 */
export async function deleteQuiz(req, res) {
  try {
    const { id } = req.params;
    await quizModel.deleteQuiz(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete quiz error:', err);
    res.status(500).json({ error: 'Failed to delete quiz.' });
  }
}