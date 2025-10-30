// Score Model: MongoDB version using Mongoose
const Score = require('../schemas/Score');

/**
 * List all scores for a user
 */
async function listScores(userId) {
  try {
    const scores = await Score.find({ userId }).sort({ attemptDate: -1 });
    // Transform data to match frontend expectations
    return scores.map(s => ({
      id: s._id.toString(),
      userId: s.userId,
      quizId: s.quizId,
      score: s.score,
      totalQuestions: s.totalQuestions,
      attemptDate: s.attemptDate,
      createdAt: s.createdAt
    }));
  } catch (error) {
    throw new Error(`Failed to list scores: ${error.message}`);
  }
}

/**
 * Record a new score for a user
 */
async function createScore(userId, quizId, scoreObj) {
  try {
    const newScore = new Score({
      userId,
      quizId,
      score: scoreObj.score,
      totalQuestions: scoreObj.totalQuestions,
      attemptDate: new Date()
    });
    const savedScore = await newScore.save();
    return savedScore;
  } catch (error) {
    throw new Error(`Failed to create score: ${error.message}`);
  }
}

/**
 * Get a score by ID
 */
async function getScore(userId, scoreId) {
  try {
    const score = await Score.findOne({ _id: scoreId, userId });
    return score;
  } catch (error) {
    throw new Error(`Failed to get score: ${error.message}`);
  }
}

/**
 * List all scores (Admin only)
 */
async function listAllScores() {
  try {
    const scores = await Score.find().sort({ attemptDate: -1 });
    // Transform data to match frontend expectations
    return scores.map(s => ({
      id: s._id.toString(),
      userId: s.userId,
      quizId: s.quizId,
      score: s.score,
      totalQuestions: s.totalQuestions,
      attemptDate: s.attemptDate,
      createdAt: s.createdAt
    }));
  } catch (error) {
    throw new Error(`Failed to list all scores: ${error.message}`);
  }
}

/**
 * List scores for a specific quiz (Admin only)
 */
async function listScoresByQuiz(quizId) {
  try {
    const scores = await Score.find({ quizId }).sort({ attemptDate: -1 });
    return scores;
  } catch (error) {
    throw new Error(`Failed to list scores by quiz: ${error.message}`);
  }
}

module.exports = {
  listScores,
  createScore,
  getScore,
  listAllScores,
  listScoresByQuiz
};