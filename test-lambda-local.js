// Local Lambda function test script
// Run with: node test-lambda-local.js

import { handler } from './lambda-upload/index.mjs';

// Mock context
const mockContext = {
    awsRequestId: 'test-request-id',
    functionName: 'test-function',
    functionVersion: '1',
    getRemainingTimeInMillis: () => 30000
};

// Test events
const testEvents = [
    {
        name: 'Health Check',
        event: {
            httpMethod: 'GET',
            path: '/',
            pathParameters: null,
            queryStringParameters: null,
            headers: {
                'Content-Type': 'application/json'
            },
            body: null,
            isBase64Encoded: false
        }
    },
    {
        name: 'Status Check',
        event: {
            httpMethod: 'GET',
            path: '/status',
            pathParameters: null,
            queryStringParameters: null,
            headers: {
                'Content-Type': 'application/json'
            },
            body: null,
            isBase64Encoded: false
        }
    },
    {
        name: 'CORS Preflight',
        event: {
            httpMethod: 'OPTIONS',
            path: '/quizzes',
            pathParameters: null,
            queryStringParameters: null,
            headers: {
                'Origin': 'http://localhost:8081',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Authorization'
            },
            body: null,
            isBase64Encoded: false
        }
    },
    {
        name: 'Quizzes without Auth (should fail)',
        event: {
            httpMethod: 'GET',
            path: '/quizzes',
            pathParameters: null,
            queryStringParameters: null,
            headers: {
                'Content-Type': 'application/json'
            },
            body: null,
            isBase64Encoded: false
        }
    },
    {
        name: 'Test Auth with Mock Token',
        event: {
            httpMethod: 'GET',
            path: '/test-auth',
            pathParameters: null,
            queryStringParameters: null,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbiJdLCJleHAiOjk5OTk5OTk5OTl9.test'
            },
            body: null,
            isBase64Encoded: false
        }
    }
];

// Run tests
async function runTests() {
    console.log('🧪 Testing Lambda Function Locally\n');
    console.log('=' .repeat(50));

    for (const test of testEvents) {
        console.log(`\n📋 Test: ${test.name}`);
        console.log('-'.repeat(30));

        try {
            const result = await handler(test.event, mockContext);
            
            console.log(`✅ Status: ${result.statusCode}`);
            console.log(`📄 Headers:`, JSON.stringify(result.headers, null, 2));
            
            let body;
            try {
                body = JSON.parse(result.body);
                console.log(`📦 Body:`, JSON.stringify(body, null, 2));
            } catch (e) {
                console.log(`📦 Body (raw):`, result.body);
            }

        } catch (error) {
            console.log(`❌ Error:`, error.message);
            console.log(`📋 Stack:`, error.stack);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🏁 Tests Complete');
    console.log('\nNext steps:');
    console.log('1. If tests pass, the Lambda function is working correctly');
    console.log('2. If tests fail, check the error messages above');
    console.log('3. For API Gateway issues, run debug-api-gateway.bat');
    console.log('4. Check CloudWatch logs for production issues');
}

// Handle ES modules
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests().catch(console.error);
}

export { runTests };