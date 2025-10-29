# 🗄️ DynamoDB Setup Guide for QuizMaster V2

## 📋 Table Configuration (Matches Your Existing Code)

### **Table Name**
```
QuizMasterTable
```
*This matches your `process.env.DYNAMODB_TABLE` in the code*

### **Partition Key (Required)**
```
Name: PK
Type: String
```
*Your code uses: `PK: 'QUIZ'` for quizzes, `PK: 'USER#${userId}'` for users*

### **Sort Key (Required for Your Code)**
```
Name: SK  
Type: String
```
*Your code uses: `SK: 'QUIZ#${id}'` - this is essential for your existing functions*

## 🎯 Why This Design?

### **Single Table Design Benefits:**
- **Cost Effective**: One table instead of multiple
- **Performance**: Fewer network calls
- **Scalability**: DynamoDB optimized for single table patterns
- **Flexibility**: Easy to add new entity types

### **Key Structure (Matches Your Existing Code):**

| Entity Type | PK | SK | Description |
|-------------|----|----|-------------|
| **Quiz** | `QUIZ` | `QUIZ#789` | Quiz data (your current pattern) |
| **User Scores** | `USER#12345` | `SCORE#QUIZ#789#1698765432000` | User's quiz scores (your current pattern) |
| **Questions** | `QUIZ#789` | `QUESTION#1` | Quiz questions |
| **Chapters** | `CHAPTER` | `CHAPTER#456` | Chapter information |
| **User Profile** | `USER#12345` | `PROFILE` | User profile data |

## 🏗️ Data Structure Design

### **1. Quizzes (Your Current Pattern)**
```json
{
  "PK": "QUIZ",
  "SK": "QUIZ#789",
  "id": "789",
  "title": "JavaScript Basics",
  "description": "Test your JavaScript knowledge",
  "subject": "programming",
  "createdAt": 1698765432000
}
```

### **2. User Scores (Your Current Pattern)**
```json
{
  "PK": "USER#cognito-sub-id",
  "SK": "SCORE#QUIZ#789#1698765432000",
  "quizId": "789",
  "score": 85,
  "totalQuestions": 10,
  "attemptDate": "2024-01-15T10:30:00Z"
}
```

### **3. Questions (Extended from your pattern)**
```json
{
  "PK": "QUIZ#789",
  "SK": "QUESTION#1",
  "question": "What is JavaScript?",
  "options": [
    "Programming language",
    "Database", 
    "Operating system",
    "Web browser"
  ],
  "correctAnswer": 0
}
```

### **4. Questions**
```json
{
  "PK": "QUIZ#789",
  "SK": "QUESTION#1",
  "question": "What is JavaScript?",
  "options": [
    "Programming language",
    "Database",
    "Operating system",
    "Web browser"
  ],
  "correctAnswer": 0,
  "explanation": "JavaScript is a programming language...",
  "points": 10
}
```

### **5. Chapters**
```json
{
  "PK": "CHAPTER#456",
  "SK": "METADATA",
  "title": "Variables and Functions",
  "description": "Learn about variables and functions",
  "subjectId": "programming",
  "order": 1,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### **6. Subjects**
```json
{
  "PK": "SUBJECT#programming",
  "SK": "METADATA",
  "name": "Programming",
  "description": "Programming fundamentals",
  "icon": "code",
  "color": "#3B82F6",
  "totalChapters": 5,
  "totalQuizzes": 25
}
```

## 🔍 Query Patterns

### **Common Queries:**

#### 1. Get All Quizzes (Your Current Code)
```javascript
{
  KeyConditionExpression: "PK = :pk",
  ExpressionAttributeValues: {
    ":pk": "QUIZ"
  }
}
```

#### 2. Get Single Quiz (Your Current Code)
```javascript
{
  Key: { 
    PK: "QUIZ", 
    SK: "QUIZ#789" 
  }
}
```

#### 3. Get User's All Scores (Your Current Code)
```javascript
{
  KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
  ExpressionAttributeValues: {
    ":pk": "USER#cognito-sub-id",
    ":sk": "SCORE#"
  }
}
```

#### 4. Get All Scores (Admin - Your Current Code)
```javascript
{
  FilterExpression: "begins_with(SK, :sk)",
  ExpressionAttributeValues: {
    ":sk": "SCORE#"
  }
}
```

## 🚀 Global Secondary Index (GSI) - Optional

### **GSI1 Configuration:**
- **Partition Key**: `GSI1PK` (String)
- **Sort Key**: `GSI1SK` (String)

### **GSI1 Usage Examples:**

| Entity | GSI1PK | GSI1SK | Use Case |
|--------|--------|--------|----------|
| Quiz | `QUIZ` | `SUBJECT#programming#2024-01-15` | List quizzes by subject |
| Score | `QUIZ#789` | `SCORE#85#2024-01-15` | Leaderboard for quiz |
| Chapter | `SUBJECT#programming` | `CHAPTER#1#Variables` | List chapters by subject |

## 📝 DynamoDB Table Creation

### **AWS Console Steps:**
1. **Go to DynamoDB Console**
2. **Click "Create table"**
3. **Enter Configuration**:
   - Table name: `QuizMasterTable`
   - Partition key: `PK` (String)
   - Sort key: `SK` (String)
4. **Settings**:
   - Billing mode: `On-demand` (recommended for development)
   - Or `Provisioned` with 5 RCU/WCU for free tier
5. **Click "Create table"**

### **AWS CLI Command:**
```bash
aws dynamodb create-table \
    --table-name QuizMasterTable \
    --attribute-definitions \
        AttributeName=PK,AttributeType=S \
        AttributeName=SK,AttributeType=S \
    --key-schema \
        AttributeName=PK,KeyType=HASH \
        AttributeName=SK,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST
```

### **CloudFormation Template:**
```yaml
Resources:
  QuizMasterTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: QuizMasterTable
      AttributeDefinitions:
        - AttributeName: PK
          AttributeType: S
        - AttributeName: SK
          AttributeType: S
      KeySchema:
        - AttributeName: PK
          KeyType: HASH
        - AttributeName: SK
          KeyType: RANGE
      BillingMode: PAY_PER_REQUEST
```

## 🔧 Updated Backend Models

### **Updated Quiz Model (DynamoDB)**
```javascript
// backend-vite/src/models/quizModel.js
import ddbDoc from '../utils/db.js';

const TableName = process.env.DYNAMODB_TABLE || 'QuizMasterTable';

export async function listQuizzes() {
  const params = {
    TableName,
    FilterExpression: 'begins_with(PK, :pk) AND SK = :sk',
    ExpressionAttributeValues: {
      ':pk': 'QUIZ#',
      ':sk': 'METADATA'
    }
  };
  const { Items } = await ddbDoc.scan(params);
  return Items;
}

export async function getQuiz(id) {
  const params = {
    TableName,
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': `QUIZ#${id}`
    }
  };
  const { Items } = await ddbDoc.query(params);
  
  const quiz = Items.find(item => item.SK === 'METADATA');
  const questions = Items.filter(item => item.SK.startsWith('QUESTION#'));
  
  return { ...quiz, questions };
}

export async function createQuiz(quiz) {
  const quizId = Date.now().toString();
  
  const item = {
    PK: `QUIZ#${quizId}`,
    SK: 'METADATA',
    id: quizId,
    ...quiz,
    createdAt: new Date().toISOString()
  };
  
  await ddbDoc.put({ TableName, Item: item });
  return item;
}
```

## 📊 Sample Data for Testing

### **Insert Sample Data Script:**
```javascript
// scripts/populate-sample-data.js
const sampleData = [
  // Sample Quiz
  {
    PK: 'QUIZ#1',
    SK: 'METADATA',
    id: '1',
    title: 'JavaScript Basics',
    description: 'Test your JavaScript knowledge',
    subject: 'programming',
    difficulty: 'beginner',
    totalQuestions: 2,
    createdAt: new Date().toISOString()
  },
  // Sample Questions
  {
    PK: 'QUIZ#1',
    SK: 'QUESTION#1',
    question: 'What is JavaScript?',
    options: ['Programming language', 'Database', 'OS', 'Browser'],
    correctAnswer: 0,
    points: 10
  },
  {
    PK: 'QUIZ#1',
    SK: 'QUESTION#2',
    question: 'What does DOM stand for?',
    options: ['Document Object Model', 'Data Object Management'],
    correctAnswer: 0,
    points: 10
  }
];

// Insert data
for (const item of sampleData) {
  await ddbDoc.put({ TableName: 'QuizMasterTable', Item: item });
}
```

## 🎯 Environment Configuration

### **Update Backend .env:**
```env
DYNAMODB_TABLE=QuizMasterTable
AWS_REGION=us-east-1
NODE_ENV=production
```

### **Update Serverless.yml:**
```yaml
provider:
  environment:
    DYNAMODB_TABLE: QuizMasterTable
  
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:Query
        - dynamodb:Scan
        - dynamodb:GetItem
        - dynamodb:PutItem
        - dynamodb:UpdateItem
        - dynamodb:DeleteItem
      Resource:
        - "arn:aws:dynamodb:${self:provider.region}:*:table/QuizMasterTable"
        - "arn:aws:dynamodb:${self:provider.region}:*:table/QuizMasterTable/index/*"
```

## ✅ **Quick Setup Checklist**

- [ ] Create DynamoDB table with `PK` and `SK`
- [ ] Update environment variables
- [ ] Update backend models to use real DynamoDB
- [ ] Test with sample data
- [ ] Deploy via GitHub Actions
- [ ] Verify all CRUD operations work

Your QuizMaster V2 will now have a production-ready, scalable database! 🚀