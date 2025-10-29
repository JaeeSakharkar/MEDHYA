// AWS Lambda handler for Serverless deployment
import serverless from 'serverless-http';
import app from './index.js';

// Export the serverless-wrapped Express app
export const handler = serverless(app);