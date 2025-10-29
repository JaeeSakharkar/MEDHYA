# S3 as Database Setup Guide

Since you don't have DynamoDB IAM permissions, we'll use S3 as a simple JSON database. This is a clever workaround that stores data in JSON files on S3.

## Architecture

```
Frontend (React) → S3 JSON Files (Database) → S3 Static Hosting (Frontend)
```

## Step 1: Create S3 Buckets

You'll need **2 S3 buckets**:

### Bucket 1: Data Storage (Database)
- **Name**: `quizmaster-data-bucket` (or your preferred name)
- **Purpose**: Store JSON files as database tables
- **Access**: Public read, private write (via your app)

### Bucket 2: Website Hosting (Frontend)
- **Name**: `quizmaster-app-bucket` (or your preferred name)  
- **Purpose**: Host your React app
- **Access**: Public read for static website hosting

## Step 2: Configure Data Bucket

### Bucket Policy for Data Bucket
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::quizmaster-data-bucket/*"
        }
    ]
}
```

### CORS Configuration for Data Bucket
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

## Step 3: Create Initial Data Files

Upload these JSON files to your data bucket:

### `data/quizzes.json`
```json
[
    {
        "id": "1",
        "title": "JavaScript Basics",
        "description": "Test your JavaScript knowledge",
        "subjectId": "1",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
        "id": "2",
        "title": "React Fundamentals", 
        "description": "Learn React basics",
        "subjectId": "1",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
]
```

### `data/questions.json`
```json
[
    {
        "id": "1",
        "quizId": "1",
        "question": "What is JavaScript?",
        "options": ["Programming language", "Database", "Operating system", "Web browser"],
        "correctAnswer": 0
    },
    {
        "id": "2", 
        "quizId": "1",
        "question": "What does DOM stand for?",
        "options": ["Document Object Model", "Data Object Management", "Dynamic Object Method", "Database Object Model"],
        "correctAnswer": 0
    }
]
```

### `data/scores.json`
```json
[]
```

### `data/users.json`
```json
[]
```

## Step 4: Update Frontend Configuration

Update `frontend/src/services/s3Storage.ts`:

```typescript
const S3_CONFIG = {
  BUCKET_NAME: 'your-actual-data-bucket-name',
  BASE_URL: 'https://your-actual-data-bucket-name.s3.amazonaws.com',
  FILES: {
    QUIZZES: 'data/quizzes.json',
    QUESTIONS: 'data/questions.json', 
    SCORES: 'data/scores.json',
    USERS: 'data/users.json'
  }
};
```

## Step 5: Switch to S3 API

Update your components to use S3 API instead of localStorage:

```typescript
// Replace this import
import { localApi } from '@/services/localApi';

// With this import  
import { s3Api } from '@/services/s3Api';

// Then replace localApi with s3Api in your components
const quizzes = await s3Api.quizzes.getAll();
```

## Step 6: Handle Write Operations

Since you don't have S3 write permissions, the app will:

1. **Read** from S3 JSON files (public read access)
2. **Write** to localStorage as fallback (until you get write access)
3. **Sync** data when you manually upload updated JSON files

### Manual Sync Process:
1. Export data from localStorage
2. Update JSON files manually
3. Upload to S3 data bucket

## Step 7: Deploy Frontend

Deploy your React app to the website hosting bucket:

```bash
# Build frontend
cd frontend && npm run build

# Upload to website bucket
aws s3 sync dist/ s3://quizmaster-app-bucket/ --delete
```

## Benefits of S3 Database Approach

✅ **No IAM Permissions Needed** - Uses public read access
✅ **Simple Setup** - Just JSON files in S3
✅ **Cost Effective** - Only S3 storage costs
✅ **Scalable** - Can handle reasonable data sizes
✅ **Backup Friendly** - JSON files are easy to backup
✅ **Version Control** - Can track changes to JSON files

## Limitations

❌ **No Real-time Updates** - Manual sync required for writes
❌ **No Transactions** - No ACID properties
❌ **Limited Concurrency** - Multiple users can't write simultaneously
❌ **Manual Scaling** - Need to manage file sizes manually

## Future Improvements

When you get proper AWS permissions:

1. **Add Lambda Functions** for write operations
2. **Use API Gateway** for proper REST API
3. **Implement S3 Signed URLs** for direct uploads
4. **Add DynamoDB** for better database features

## File Structure in S3

```
📁 Data Bucket (quizmaster-data-bucket)/
├── 📁 data/
│   ├── quizzes.json     (Quiz data)
│   ├── questions.json   (Question data)
│   ├── scores.json      (Score data)
│   └── users.json       (User data)

📁 Website Bucket (quizmaster-app-bucket)/
├── 📁 assets/
│   ├── index-[hash].js
│   └── index-[hash].css
├── index.html
├── favicon.ico
└── ...other frontend files
```

This setup gives you a working database solution using only S3, perfect for your IAM permission constraints!