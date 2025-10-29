# API Gateway Debug Guide

This guide helps you debug common API Gateway issues with your Lambda function.

## Common Issues and Solutions

### 1. 502 Bad Gateway Error
**Cause**: Lambda function error or timeout
**Debug Steps**:
1. Check CloudWatch logs for Lambda function
2. Verify Lambda function permissions
3. Check Lambda timeout settings (increase to 30 seconds)

### 2. 403 Forbidden Error
**Cause**: Authentication issues or missing permissions
**Debug Steps**:
1. Verify JWT token is being sent correctly
2. Check Cognito configuration
3. Verify admin group membership

### 3. 404 Not Found Error
**Cause**: Route not configured properly
**Debug Steps**:
1. Check API Gateway resource configuration
2. Verify proxy integration setup
3. Check Lambda function route matching

### 4. CORS Issues
**Cause**: Missing CORS headers or incorrect configuration
**Debug Steps**:
1. Enable CORS in API Gateway console
2. Verify preflight OPTIONS requests
3. Check CORS headers in Lambda response

## Debug Steps

### Step 1: Test Lambda Function Directly

Use AWS Lambda console to test your function with this test event:

```json
{
  "httpMethod": "GET",
  "path": "/",
  "pathParameters": null,
  "queryStringParameters": null,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": null,
  "isBase64Encoded": false
}
```

### Step 2: Test API Gateway Endpoints

Test each endpoint individually:

1. **Health Check**: `GET /`
2. **Status**: `GET /status`
3. **Auth Test**: `GET /test-auth` (with Authorization header)
4. **Quizzes**: `GET /quizzes` (with Authorization header)

### Step 3: Check CloudWatch Logs

1. Go to CloudWatch → Log groups
2. Find `/aws/lambda/your-function-name`
3. Check recent log streams for errors

### Step 4: Verify API Gateway Configuration

1. **Integration Type**: Lambda Proxy Integration
2. **Resource**: `{proxy+}` with ANY method
3. **CORS**: Enabled for all origins
4. **Deploy**: Make sure to deploy after changes

## Test Script

Use this script to test your API Gateway:

```bash
# Set your API Gateway URL
API_URL="https://your-api-id.execute-api.us-east-1.amazonaws.com/prod"

# Test health check
curl -X GET "$API_URL/"

# Test with authentication (replace with your JWT token)
JWT_TOKEN="your-jwt-token-here"

curl -X GET "$API_URL/test-auth" \
  -H "Authorization: Bearer $JWT_TOKEN"

curl -X GET "$API_URL/quizzes" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

## Lambda Function Issues

### Issue 1: Route Matching
The Lambda function uses exact route matching. Make sure your API Gateway is configured with:
- Resource: `{proxy+}`
- Method: `ANY`
- Integration: Lambda Proxy

### Issue 2: Path Parameters
For routes like `/quizzes/{id}`, the Lambda function expects:
```javascript
event.pathParameters.id
```

### Issue 3: CORS Headers
Every response must include CORS headers. The Lambda function includes them automatically.

## API Gateway Configuration Checklist

- [ ] Lambda function deployed and working
- [ ] API Gateway created with correct region
- [ ] Resource `{proxy+}` created
- [ ] Method `ANY` added to `{proxy+}`
- [ ] Lambda Proxy Integration enabled
- [ ] CORS enabled (if needed)
- [ ] API deployed to stage (e.g., 'prod')
- [ ] Lambda function has API Gateway invoke permissions

## Environment Variables

Make sure these are set in your Lambda function:

```
DYNAMODB_TABLE=QuizMasterTable
COGNITO_POOL_ID=us-east-1_RsOYVRSJu
COGNITO_CLIENT_ID=6npa9g9it0o66diikabm29j9je
COGNITO_REGION=us-east-1
AWS_REGION=us-east-1
```

## Troubleshooting Commands

### Test Lambda Function Locally
```bash
# Install dependencies
npm install

# Test function
node test-lambda-local.js
```

### Check API Gateway Logs
```bash
# Enable API Gateway logging
aws apigateway put-stage \
  --rest-api-id YOUR_API_ID \
  --stage-name prod \
  --patch-ops op=replace,path=/*/logging/loglevel,value=INFO
```

### Test with curl
```bash
# Test health endpoint
curl -v https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/

# Test with authentication
curl -v -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/quizzes
```

## Common Error Messages

### "Endpoint not found"
- Check API Gateway resource configuration
- Verify Lambda function route matching
- Make sure API is deployed

### "Missing Authorization header"
- Add Authorization header to request
- Check JWT token format (should be "Bearer TOKEN")

### "Admin access required"
- Verify user is in 'admin' group in Cognito
- Check JWT token contains correct groups

### "Internal server error"
- Check CloudWatch logs for detailed error
- Verify DynamoDB table exists and has correct permissions
- Check Lambda function timeout settings

## Next Steps

If issues persist:
1. Check CloudWatch logs for detailed errors
2. Test Lambda function directly in AWS console
3. Verify all AWS permissions are correct
4. Consider using AWS X-Ray for detailed tracing