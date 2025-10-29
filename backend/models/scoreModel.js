// Score Model: Track user's quiz attempts/results
const ddbDoc = require('../db');
const TableName = process.env.DYNAMODB_TABLE;

/**
 * List all scores for a user
 */
async function listScores(userId) {
  const params = {
    TableName,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':sk': 'SCORE#'
    }
  };
  const { Items } = await ddbDoc.query(params);
  return Items;
}

/**
 * Record a new score for a user
 */
async function createScore(userId, quizId, scoreObj) {
  const item = {
    PK: `USER#${userId}`,
    SK: `SCORE#QUIZ#${quizId}#${Date.now()}`,
    quizId,
    score: scoreObj.score,
    totalQuestions: scoreObj.totalQuestions,
    attemptDate: new Date().toISOString()
  };
  await ddbDoc.put({ TableName, Item: item });
  return item;
}

/**
 * Get a score by SK
 */
async function getScore(userId, scoreSk) {
  const params = {
    TableName,
    Key: { PK: `USER#${userId}`, SK: scoreSk }
  };
  const { Item } = await ddbDoc.get(params);
  return Item;
}

/**
 * List all scores (Admin only)
 */
async function listAllScores() {
  const params = {
    TableName,
    FilterExpression: 'begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':sk': 'SCORE#'
    }
  };
  const { Items } = await ddbDoc.scan(params);
  return Items;
}

/**
 * List scores for a specific quiz (Admin only)
 */
async function listScoresByQuiz(quizId) {
  const params = {
    TableName,
    FilterExpression: 'quizId = :quizId AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':quizId': quizId,
      ':sk': 'SCORE#'
    }
  };
  const { Items } = await ddbDoc.scan(params);
  return Items;
}

module.exports = {
  listScores,
  createScore,
  getScore,
  listAllScores,
  listScoresByQuiz
};
