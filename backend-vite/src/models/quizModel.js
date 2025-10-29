// Quiz Model: Lambda-optimized DynamoDB operations
let ddbDoc, TableName, mockModels, useMockDb;

// Initialize database connection (Lambda-optimized)
async function initializeDb() {
  // Determine database type after env vars are loaded
  // Force mock data for local development due to AWS credential issues
  useMockDb = true; // Set to false when you have AWS credentials
  console.log('DYNAMODB_TABLE env var:', process.env.DYNAMODB_TABLE);
  console.log('useMockDb determined as:', useMockDb);
  
  if (useMockDb) {
    if (!mockModels) {
      console.log('Initializing mock database for quizzes');
      const { mockModels: models } = await import('../utils/db-mock.js');
      mockModels = models;
    }
  } else {
    if (!ddbDoc) {
      console.log('Initializing DynamoDB connection for quizzes');
      const db = await import('../utils/db.js');
      ddbDoc = db.default;
      TableName = process.env.DYNAMODB_TABLE;
    }
  }
}

/**
 * List all quizzes in the database.
 * Returns array of quiz items.
 */
export async function listQuizzes() {
  await initializeDb();
  
  if (useMockDb) {
    return await mockModels.listQuizzes();
  }
  
  try {
    const params = {
      TableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': 'QUIZ'
      }
    };
    
    console.log('DynamoDB Query - listQuizzes:', params);
    const { QueryCommand } = await import('../utils/db.js');
    const { Items } = await ddbDoc.send(new QueryCommand(params));
    console.log(`Found ${Items?.length || 0} quizzes`);
    
    return Items || [];
  } catch (error) {
    console.error('Error listing quizzes:', error);
    throw new Error(`Failed to list quizzes: ${error.message}`);
  }
}

/**
 * Create a new quiz.
 * quiz = {id, title, description, chapterId, ...}
 */
export async function createQuiz(quiz) {
  console.log('createQuiz called with:', quiz);
  await initializeDb();
  
  console.log('Database initialized, useMockDb:', useMockDb);
  console.log('DYNAMODB_TABLE:', process.env.DYNAMODB_TABLE);
  
  if (useMockDb) {
    console.log('Using mock database for createQuiz');
    const result = await mockModels.createQuiz(quiz);
    console.log('Mock createQuiz result:', result);
    return result;
  }
  
  try {
    const quizId = quiz.id || Date.now().toString();
    const item = {
      PK: 'QUIZ',
      SK: `QUIZ#${quizId}`,
      id: quizId,
      ...quiz,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('DynamoDB Put - createQuiz:', item);
    const { PutCommand } = await import('../utils/db.js');
    await ddbDoc.send(new PutCommand({ TableName, Item: item }));
    console.log(`Quiz created with ID: ${quizId}`);
    
    return item;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw new Error(`Failed to create quiz: ${error.message}`);
  }
}

/**
 * Get a single quiz by id.
 */
export async function getQuiz(id) {
  await initializeDb();
  
  if (useMockDb) {
    return await mockModels.getQuiz(id);
  }
  
  try {
    const params = {
      TableName,
      Key: { PK: 'QUIZ', SK: `QUIZ#${id}` }
    };
    
    console.log('DynamoDB Get - getQuiz:', params);
    const { GetCommand } = await import('../utils/db.js');
    const { Item } = await ddbDoc.send(new GetCommand(params));
    console.log(`Quiz ${id} ${Item ? 'found' : 'not found'}`);
    
    return Item;
  } catch (error) {
    console.error('Error getting quiz:', error);
    throw new Error(`Failed to get quiz: ${error.message}`);
  }
}

/**
 * Update quiz details.
 */
export async function updateQuiz(id, updates) {
  await initializeDb();
  
  if (useMockDb) {
    return await mockModels.updateQuiz(id, updates);
  }
  
  try {
    // Build dynamic update expression
    const updateExpressions = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};
    
    Object.keys(updates).forEach((key, index) => {
      if (key !== 'id' && key !== 'PK' && key !== 'SK') {
        const valueKey = `:val${index}`;
        const nameKey = `#attr${index}`;
        
        updateExpressions.push(`#attr${index} = :val${index}`);
        expressionAttributeValues[valueKey] = updates[key];
        expressionAttributeNames[nameKey] = key;
      }
    });
    
    // Add updatedAt timestamp
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    
    const params = {
      TableName,
      Key: { PK: 'QUIZ', SK: `QUIZ#${id}` },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW'
    };
    
    console.log('DynamoDB Update - updateQuiz:', params);
    const { UpdateCommand } = await import('../utils/db.js');
    const { Attributes } = await ddbDoc.send(new UpdateCommand(params));
    console.log(`Quiz ${id} updated successfully`);
    
    return Attributes;
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw new Error(`Failed to update quiz: ${error.message}`);
  }
}

/**
 * Delete quiz by id.
 */
export async function deleteQuiz(id) {
  await initializeDb();
  
  if (useMockDb) {
    return await mockModels.deleteQuiz(id);
  }
  
  const { DeleteCommand } = await import('../utils/db.js');
  await ddbDoc.send(new DeleteCommand({
    TableName,
    Key: { PK: 'QUIZ', SK: `QUIZ#${id}` }
  }));
  return true;
}