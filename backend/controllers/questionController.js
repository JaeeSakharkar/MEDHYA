const { questionModel } = require('../models');

/**
 * List all questions for a quiz.
 */
async function getQuestions(req, res) {
  try {
    const { quizId } = req.params;
    const questions = await questionModel.listQuestions(quizId);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list questions.' });
  }
}

/**
 * Create question.
 */
async function createQuestion(req, res) {
  try {
    const { quizId } = req.params;
    const question = req.body;
    const result = await questionModel.createQuestion(quizId, question);
    res.status(201).json(result);
  } catch (err) {
    console.error('Question creation error:', err.message);
    res.status(500).json({ error: 'Failed to create question.' });
  }
}

/**
 * Update question.
 */
async function updateQuestion(req, res) {
  try {
    const { quizId, questionId } = req.params;
    const updates = req.body;
    const result = await questionModel.updateQuestion(quizId, questionId, updates);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update question.' });
  }
}

/**
 * Delete question.
 */
async function deleteQuestion(req, res) {
  try {
    const { quizId, questionId } = req.params;
    await questionModel.deleteQuestion(quizId, questionId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete question.' });
  }
}

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
};
