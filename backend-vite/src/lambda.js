// AWS Lambda handler for Serverless deployment
import serverlessHttp from 'serverless-http';
import app from './index.js';

// Configure serverless-http for Lambda
const serverlessApp = serverlessHttp(app, {
    binary: ['image/*', 'application/pdf', 'application/octet-stream'],
    request: (request, event, context) => {
        // Add Lambda context to request
        request.lambda = {
            event,
            context,
            requestId: context.awsRequestId
        };
    }
});

// Export the Lambda handler
export const handler = async (event, context) => {
    // Set Lambda context timeout
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const result = await serverlessApp(event, context);
        return result;
    } catch (error) {
        console.error('Lambda handler error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
            },
            body: JSON.stringify({
                error: 'Internal server error',
                requestId: context.awsRequestId
            })
        };
    }
};