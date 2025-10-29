// QuizMaster V2 Lambda Function - Standalone .mjs format
// This file can be zipped and uploaded directly to AWS Lambda Console

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const ddbDoc = DynamoDBDocumentClient.from(ddbClient);

// Environment variables
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'QuizMasterTable';
const COGNITO_POOL_ID = process.env.COGNITO_POOL_ID || 'us-east-1_RsOYVRSJu';
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || '6npa9g9it0o66diikabm29j9je';
const COGNITO_REGION = process.env.COGNITO_REGION || 'us-east-1';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Requested-With',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

// Response helper
function createResponse(statusCode, body, additionalHeaders = {}) {
  return {
    statusCode,
    headers: { ...corsHeaders, ...additionalHeaders },
    body: JSON.stringify(body)
  };
}

// JWT verification (simplified for Lambda)
function verifyJWT(token) {
  try {
    // Basic JWT decode (in production, verify signature against Cognito JWKS)
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    
    // Check if token is expired
    if (payload.exp * 1000 < Date.now()) {
      throw new Error('Token expired');
    }
    
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Authentication middleware
function authenticate(event) {
  const authHeader = event.headers?.Authorization || event.headers?.authorization;
  
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }
  
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  return verifyJWT(token);
}

// Check if user is admin
function isAdmin(user) {
  const groups = user['cognito:groups'] || [];
  return groups.includes('admin');
}

// Quiz operations
const quizOperations = {
  async listQuizzes() {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: { ':pk': 'QUIZ' }
    };
    
    const result = await ddbDoc.send(new QueryCommand(params));
    return result.Items || [];
  },

  async getQuiz(id) {
    const params = {
      TableName: TABLE_NAME,
      Key: { PK: 'QUIZ', SK: `QUIZ#${id}` }
    };
    
    const result = await ddbDoc.send(new GetCommand(params));
    return result.Item;
  },

  async createQuiz(quiz, userId) {
    const quizId = Date.now().toString();
    const item = {
      PK: 'QUIZ',
      SK: `QUIZ#${quizId}`,
      id: quizId,
      ...quiz,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await ddbDoc.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    return item;
  },

  async updateQuiz(id, updates) {
    const updateExpressions = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};
    
    Object.keys(updates).forEach((key, index) => {
      if (key !== 'id' && key !== 'PK' && key !== 'SK') {
        updateExpressions.push(`#attr${index} = :val${index}`);
        expressionAttributeValues[`:val${index}`] = updates[key];
        expressionAttributeNames[`#attr${index}`] = key;
      }
    });
    
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    
    const params = {
      TableName: TABLE_NAME,
      Key: { PK: 'QUIZ', SK: `QUIZ#${id}` },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW'
    };
    
    const result = await ddbDoc.send(new UpdateCommand(params));
    return result.Attributes;
  },

  async deleteQuiz(id) {
    const params = {
      TableName: TABLE_NAME,
      Key: { PK: 'QUIZ', SK: `QUIZ#${id}` }
    };
    
    await ddbDoc.send(new DeleteCommand(params));
    return { success: true };
  }
};

// Score operations
const scoreOperations = {
  async getUserScores(userId) {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': 'SCORE#'
      }
    };
    
    const result = await ddbDoc.send(new QueryCommand(params));
    return result.Items || [];
  },

  async createScore(userId, scoreData) {
    const item = {
      PK: `USER#${userId}`,
      SK: `SCORE#QUIZ#${scoreData.quizId}#${Date.now()}`,
      ...scoreData,
      attemptDate: new Date().toISOString()
    };
    
    await ddbDoc.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    return item;
  },

  async getAllScores() {
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: 'begins_with(SK, :sk)',
      ExpressionAttributeValues: { ':sk': 'SCORE#' }
    };
    
    const result = await ddbDoc.send(new ScanCommand(params));
    return result.Items || [];
  }
};

// Route handlers
const routes = {
  // Health check
  'GET /': async () => {
    return createResponse(200, {
      message: 'QuizMaster V2 Lambda Backend Running!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      lambda: {
        functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
        functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
        region: process.env.AWS_REGION
      },
      database: TABLE_NAME,
      cognito: {
        poolId: COGNITO_POOL_ID,
        region: COGNITO_REGION
      }
    });
  },

  // Status check
  'GET /status': async () => {
    return createResponse(200, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  },

  // Test authentication
  'GET /test-auth': async (event) => {
    const user = authenticate(event);
    return createResponse(200, {
      message: 'Authentication successful!',
      user: {
        id: user.sub,
        email: user.email,
        groups: user['cognito:groups'] || [],
        isAdmin: isAdmin(user)
      }
    });
  },

  // Quiz routes
  'GET /quizzes': async (event) => {
    authenticate(event);
    const quizzes = await quizOperations.listQuizzes();
    return createResponse(200, quizzes);
  },

  'GET /quizzes/{id}': async (event) => {
    authenticate(event);
    const id = event.pathParameters?.id;
    const quiz = await quizOperations.getQuiz(id);
    
    if (!quiz) {
      return createResponse(404, { error: 'Quiz not found' });
    }
    
    return createResponse(200, quiz);
  },

  'POST /quizzes': async (event) => {
    const user = authenticate(event);
    
    if (!isAdmin(user)) {
      return createResponse(403, { error: 'Admin access required' });
    }
    
    const quizData = JSON.parse(event.body);
    const quiz = await quizOperations.createQuiz(quizData, user.sub);
    return createResponse(201, quiz);
  },

  'PUT /quizzes/{id}': async (event) => {
    const user = authenticate(event);
    
    if (!isAdmin(user)) {
      return createResponse(403, { error: 'Admin access required' });
    }
    
    const id = event.pathParameters?.id;
    const updates = JSON.parse(event.body);
    const quiz = await quizOperations.updateQuiz(id, updates);
    return createResponse(200, quiz);
  },

  'DELETE /quizzes/{id}': async (event) => {
    const user = authenticate(event);
    
    if (!isAdmin(user)) {
      return createResponse(403, { error: 'Admin access required' });
    }
    
    const id = event.pathParameters?.id;
    await quizOperations.deleteQuiz(id);
    return createResponse(200, { success: true });
  },

  // Score routes
  'GET /scores': async (event) => {
    const user = authenticate(event);
    const scores = await scoreOperations.getUserScores(user.sub);
    return createResponse(200, scores);
  },

  'POST /scores': async (event) => {
    const user = authenticate(event);
    const scoreData = JSON.parse(event.body);
    const score = await scoreOperations.createScore(user.sub, scoreData);
    return createResponse(201, score);
  },

  'GET /scores/all': async (event) => {
    const user = authenticate(event);
    
    if (!isAdmin(user)) {
      return createResponse(403, { error: 'Admin access required' });
    }
    
    const scores = await scoreOperations.getAllScores();
    return createResponse(200, scores);
  },

  // User profile
  'GET /users/profile': async (event) => {
    const user = authenticate(event);
    return createResponse(200, {
      id: user.sub,
      email: user.email,
      name: user.name || user.email,
      groups: user['cognito:groups'] || []
    });
  },

  // Mock users list (admin only)
  'GET /users': async (event) => {
    const user = authenticate(event);
    
    if (!isAdmin(user)) {
      return createResponse(403, { error: 'Admin access required' });
    }
    
    return createResponse(200, [
      {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        groups: ['admin'],
        status: 'CONFIRMED'
      },
      {
        id: '2',
        email: 'user@example.com',
        name: 'Regular User',
        groups: [],
        status: 'CONFIRMED'
      }
    ]);
  }
};

// Main Lambda handler
export const handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, {});
    }
    
    // Build route key
    const method = event.httpMethod;
    let path = event.path || '/';
    
    // Handle proxy path - extract the actual path
    if (event.pathParameters && event.pathParameters.proxy) {
      path = '/' + event.pathParameters.proxy;
    }
    
    const routeKey = `${method} ${path}`;
    
    console.log('Route key:', routeKey);
    console.log('Event path:', event.path);
    console.log('Path parameters:', event.pathParameters);
    
    // Find matching route
    let handler = routes[routeKey];
    
    // If exact match not found, try with root path
    if (!handler && path === '/') {
      handler = routes[`${method} /`];
    }
    
    if (!handler) {
      return createResponse(404, { 
        error: 'Endpoint not found',
        method,
        path,
        availableRoutes: Object.keys(routes)
      });
    }
    
    // Execute route handler
    const result = await handler(event, context);
    return result;
    
  } catch (error) {
    console.error('Lambda error:', error);
    
    // Handle authentication errors
    if (error.message.includes('Missing Authorization') || 
        error.message.includes('Invalid token') || 
        error.message.includes('Token expired')) {
      return createResponse(401, { error: error.message });
    }
    
    // Handle other errors
    return createResponse(500, { 
      error: 'Internal server error',
      message: error.message,
      requestId: context.awsRequestId
    });
  }
};