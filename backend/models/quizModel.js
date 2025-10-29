// Quiz Model: All Quiz CRUD logic using DynamoDB
const ddbDoc = require('../db');
const TableName = process.env.DYNAMODB_TABLE;

/**
 * List all quizzes in the database.
 * Returns array of quiz items.
 */
async function listQuizzes() {
  const params = {
    TableName,
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': 'QUIZ'
    }
  };
  const { Items } = await ddbDoc.query(params);
  return Items;
}

/**
 * Create a new quiz.
 * quiz = {id, title, description, chapterId, ...}
 */
async function createQuiz(quiz) {
  const item = {
    PK: 'QUIZ',
    SK: `QUIZ#${quiz.id}`,
    ...quiz,
    createdAt: Date.now()
  };
  await ddbDoc.put({ TableName, Item: item });
  return item;
}

/**
 * Get a single quiz by id.
 */
async function getQuiz(id) {
  const params = {
    TableName,
    Key: { PK: 'QUIZ', SK: `QUIZ#${id}` }
  };
  const { Item } = await ddbDoc.get(params);
  return Item;
}

/**
 * Update quiz details.
 */
async function updateQuiz(id, updates) {
  const params = {
    TableName,
    Key: { PK: 'QUIZ', SK: `QUIZ#${id}` },
    UpdateExpression: 'set title = :t, description = :d',
    ExpressionAttributeValues: {
      ':t': updates.title,
      ':d': updates.description
    },
    ReturnValues: 'ALL_NEW'
  };
  const { Attributes } = await ddbDoc.update(params);
  return Attributes;
}

/**
 * Delete quiz by id.
 */
async function deleteQuiz(id) {
  await ddbDoc.delete({
    TableName,
    Key: { PK: 'QUIZ', SK: `QUIZ#${id}` }
  });
  return true;
}

module.exports = {
  listQuizzes,
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz
};
