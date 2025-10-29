// Local test for Lambda function
import { handler } from './index.mjs';

// Mock Lambda event for testing
const mockEvent = {
  httpMethod: 'GET',
  path: '/',
  resource: '/',
  headers: {
    'Content-Type': 'application/json'
  },
  queryStringParameters: null,
  pathParameters: null,
  body: null
};

// Mock Lambda context
const mockContext = {
  awsRequestId: 'test-request-id',
  functionName: 'test-function',
  functionVersion: '$LATEST',
  getRemainingTimeInMillis: () => 30000
};

// Test the handler
async function testHandler() {
  console.log('🧪 Testing Lambda Handler Locally');
  console.log('=================================');
  
  try {
    console.log('📤 Input Event:', JSON.stringify(mockEvent, null, 2));
    
    const result = await handler(mockEvent, mockContext);
    
    console.log('📥 Response:', JSON.stringify(result, null, 2));
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test if this file is executed directly
if (process.argv[1].endsWith('test-local.mjs')) {
  testHandler();
}