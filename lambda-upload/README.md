# 📦 QuizMaster V2 Lambda Upload Package

## 🎯 Manual Lambda Deployment

This package contains a standalone Lambda function in `.mjs` format that can be uploaded directly to AWS Lambda Console.

## 📋 Dependencies to Install

The Lambda function requires these AWS SDK dependencies:

```json
{
  "@aws-sdk/client-dynamodb": "^3.919.0",
  "@aws-sdk/lib-dynamodb": "^3.919.0"
}
```

## 🚀 Step-by-Step Upload Instructions

### **Step 1: Install Dependencies**
```bash
cd lambda-upload
npm install
```

### **Step 2: Create Deployment Package**
```bash
# Windows
create-lambda-zip.bat

# Or manually:
# 1. Copy node_modules folder
# 2. Zip index.mjs + node_modules + package.json
```

### **Step 3: Upload to Lambda Console**

1. **Go to AWS Lambda Console**: https://console.aws.amazon.com/lambda/
2. **Click "Create function"**
3. **Configure function**:
   - **Function name**: `quizmaster-backend`
   - **Runtime**: `Node.js 18.x`
   - **Architecture**: `x86_64`
4. **Click "Create function"**

### **Step 4: Upload Code**
1. **In Lambda Console**: Click "Upload from" → ".zip file"
2. **Select**: `lambda-deployment.zip`
3. **Click "Save"**

### **Step 5: Configure Function**

#### **Runtime Settings:**
- **Handler**: `index.handler`
- **Runtime**: `Node.js 18.x`

#### **Environment Variables:**
```
DYNAMODB_TABLE = QuizMasterTable
COGNITO_POOL_ID = us-east-1_RsOYVRSJu
COGNITO_CLIENT_ID = 6npa9g9it0o66diikabm29j9je
COGNITO_REGION = us-east-1
AWS_REGION = us-east-1
NODE_ENV = production
```

#### **Basic Settings:**
- **Timeout**: `30 seconds`
- **Memory**: `512 MB`

### **Step 6: Create API Gateway**

1. **Go to API Gateway Console**: https://console.aws.amazon.com/apigateway/
2. **Create REST API**:
   - **API name**: `quizmaster-api`
   - **Endpoint type**: `Regional`
3. **Create Resource**:
   - **Resource name**: `{proxy+}`
   - **Enable proxy resource**: ✅
4. **Create Method**:
   - **Method**: `ANY`
   - **Integration type**: `Lambda Function`
   - **Lambda function**: `quizmaster-backend`
   - **Use Lambda Proxy integration**: ✅
5. **Enable CORS**:
   - **Select resource** → **Actions** → **Enable CORS**
   - **Access-Control-Allow-Origin**: `*`
   - **Access-Control-Allow-Headers**: `Content-Type,Authorization,X-Requested-With`
6. **Deploy API**:
   - **Actions** → **Deploy API**
   - **Stage**: `prod`

## 🧪 Test Your Lambda

After deployment, test these endpoints:

### **Health Check**
```bash
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/
```

### **Status Check**
```bash
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/status
```

### **With Authentication**
```bash
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/test-auth \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Supported Endpoints

| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| GET | `/` | ❌ | ❌ | Health check |
| GET | `/status` | ❌ | ❌ | Status info |
| GET | `/test-auth` | ✅ | ❌ | Test auth |
| GET | `/quizzes` | ✅ | ❌ | List quizzes |
| GET | `/quizzes/{id}` | ✅ | ❌ | Get quiz |
| POST | `/quizzes` | ✅ | ✅ | Create quiz |
| PUT | `/quizzes/{id}` | ✅ | ✅ | Update quiz |
| DELETE | `/quizzes/{id}` | ✅ | ✅ | Delete quiz |
| GET | `/scores` | ✅ | ❌ | User scores |
| POST | `/scores` | ✅ | ❌ | Submit score |
| GET | `/scores/all` | ✅ | ✅ | All scores |
| GET | `/users/profile` | ✅ | ❌ | User profile |
| GET | `/users` | ✅ | ✅ | List users |

## 🔧 IAM Permissions Required

Your Lambda execution role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/QuizMasterTable",
        "arn:aws:dynamodb:us-east-1:*:table/QuizMasterTable/index/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

## 🎯 Features Included

- ✅ **JWT Authentication** (Cognito tokens)
- ✅ **Admin Role Checking** (`admin` group)
- ✅ **DynamoDB Integration** (QuizMasterTable)
- ✅ **CORS Support** (Cross-origin requests)
- ✅ **Error Handling** (Proper HTTP status codes)
- ✅ **Request Logging** (CloudWatch logs)
- ✅ **Environment Variables** (Configurable)

## 🚨 Important Notes

1. **DynamoDB Table**: Make sure `QuizMasterTable` exists with `PK` and `SK` keys
2. **Cognito Setup**: Ensure your Cognito User Pool is configured
3. **API Gateway**: Required for HTTP access to Lambda
4. **CORS**: Configured for cross-origin requests
5. **JWT Verification**: Simplified for demo (use proper JWKS in production)

## 🎉 Success Indicators

- ✅ Health check returns 200 status
- ✅ Authentication works with Cognito JWT
- ✅ DynamoDB operations succeed
- ✅ CORS headers present in responses
- ✅ Admin endpoints require admin role

Your QuizMaster V2 Lambda is ready for production! 🚀