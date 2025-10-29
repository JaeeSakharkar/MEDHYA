// Question Model: CRUD for MCQs under a quiz in DynamoDB
const ddbDoc = require('../db');
const TableName = process.env.DYNAMODB_TABLE;

/**
 * List all questions for a quiz
 */
async function listQuestions(quizId) {
  const params = {
    TableName,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `QUIZ#${quizId}`,
      ':sk': 'QUESTION#'
    }
  };
  const { Items } = await ddbDoc.query(params);
  return Items;
}

/**
 * Create a question for a quiz
 */
async function createQuestion(quizId, question) {
  const item = {
    PK: `QUIZ#${quizId}`,
    SK: `QUESTION#${question.id}`,
    questionText: question.text,
    options: question.options, // Array
    correctAnswer: question.correctAnswer,
    createdAt: Date.now()
  };
  await ddbDoc.put({ TableName, Item: item });
  return item;
}

/**
 * Get a question by id
 */
async function getQuestion(quizId, questionId) {
  const params = {
    TableName,
    Key: { PK: `QUIZ#${quizId}`, SK: `QUESTION#${questionId}` }
  };
  const { Item } = await ddbDoc.get(params);
  return Item;
}

/**
 * Update a question
 */
async function updateQuestion(quizId, questionId, updates) {
  const params = {
    TableName,
    Key: { PK: `QUIZ#${quizId}`, SK: `QUESTION#${questionId}` },
    UpdateExpression: 'set questionText = :qt, options = :op, correctAnswer = :ca',
    ExpressionAttributeValues: {
      ':qt': updates.text,
      ':op': updates.options,
      ':ca': updates.correctAnswer
    },
    ReturnValues: 'ALL_NEW'
  };
  const { Attributes } = await ddbDoc.update(params);
  return Attributes;
}

/**
 * Delete a question
 */
async function deleteQuestion(quizId, questionId) {
  await ddbDoc.delete({
    TableName,
    Key: { PK: `QUIZ#${quizId}`, SK: `QUESTION#${questionId}` }
  });
  return true;
}

module.exports = {
  listQuestions,
  createQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion
};
