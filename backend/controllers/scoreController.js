const scoreModel = require('../models/scoreModel');

/**
 * List all scores for logged-in user.
 */
async function getScores(req, res) {
  try {
    const userId = req.user.sub;
    const scores = await scoreModel.listScores(userId);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get scores.' });
  }
}

/**
 * Submit quiz score.
 */
async function submitScore(req, res) {
  try {
    const userId = req.user.sub;
    const { quizId, score, totalQuestions } = req.body;
    const result = await scoreModel.createScore(userId, quizId, { score, totalQuestions });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit score.' });
  }
}

/**
 * Get all scores (Admin only).
 */
async function getAllScores(req, res) {
  try {
    const scores = await scoreModel.listAllScores();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get all scores.' });
  }
}

/**
 * Get scores for specific quiz (Admin only).
 */
async function getScoresForQuiz(req, res) {
  try {
    const { quizId } = req.params;
    const scores = await scoreModel.listScoresByQuiz(quizId);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get quiz scores.' });
  }
}

module.exports = {
  getScores,
  submitScore,
  getAllScores,
  getScoresForQuiz
};
