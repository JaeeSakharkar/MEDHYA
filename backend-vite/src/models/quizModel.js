// Quiz Model: All Quiz CRUD logic using DynamoDB
const useMockDb = !process.env.DYNAMODB_TABLE || process.env.NODE_ENV === 'development';

let ddbDoc, TableName, mockModels;

if (useMockDb) {
  console.log('Using mock database for quizzes');
  const { mockModels: models } = await import('../utils/db-mock.js');
  mockModels = models;
} else {
  const db = await import('../utils/db.js');
  ddbDoc = db.default;
  TableName = process.env.DYNAMODB_TABLE;
}

/**
 * List all quizzes in the database.
 * Returns array of quiz items.
 */
export async function listQuizzes() {
  if (useMockDb) {
    return await mockModels.listQuizzes();
  }
  
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
export async function createQuiz(quiz) {
  if (useMockDb) {
    return await mockModels.createQuiz(quiz);
  }
  
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
export async function getQuiz(id) {
  if (useMockDb) {
    return await mockModels.getQuiz(id);
  }
  
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
export async function updateQuiz(id, updates) {
  if (useMockDb) {
    return await mockModels.updateQuiz(id, updates);
  }
  
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
export async function deleteQuiz(id) {
  if (useMockDb) {
    return await mockModels.deleteQuiz(id);
  }
  
  await ddbDoc.delete({
    TableName,
    Key: { PK: 'QUIZ', SK: `QUIZ#${id}` }
  });
  return true;
}