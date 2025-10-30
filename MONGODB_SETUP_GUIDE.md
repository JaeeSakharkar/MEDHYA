# 🍃 MongoDB Setup Guide

Your project now supports both MongoDB and DynamoDB! Here's how to set up MongoDB:

## 🚀 Quick Setup Options

### Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

1. **Sign up for MongoDB Atlas**
   - Go to https://www.mongodb.com/atlas
   - Create a free account
   - Choose "Build a Database" → "M0 Sandbox" (Free tier)

2. **Configure Database**
   - Choose a cloud provider (AWS recommended)
   - Select a region close to you
   - Name your cluster (e.g., "QuizMaster")

3. **Set up Database Access**
   - Create a database user with username/password
   - Add your IP address to the IP Access List (or use 0.0.0.0/0 for development)

4. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

5. **Update Environment Variables**
   ```bash
   # In backend/.env
   DB_TYPE=mongodb
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quizmaster
   ```

### Option 2: Local MongoDB

1. **Install MongoDB**
   - Download from https://www.mongodb.com/try/download/community
   - Or use package manager: `brew install mongodb-community` (Mac) or `choco install mongodb` (Windows)

2. **Start MongoDB**
   ```bash
   # Start MongoDB service
   mongod
   ```

3. **Update Environment Variables**
   ```bash
   # In backend/.env
   DB_TYPE=mongodb
   MONGODB_URI=mongodb://localhost:27017/quizmaster
   ```

## 🔧 Testing the Setup

1. **Start your backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check the console output**
   - You should see: "🍃 Using MongoDB models"
   - And: "🍃 MongoDB Connected: [your-host]"

3. **Test API endpoints**
   - Your existing API endpoints will work the same way
   - Data will now be stored in MongoDB instead of DynamoDB

## 🔄 Switching Between Databases

You can easily switch between MongoDB and DynamoDB by changing the `DB_TYPE` environment variable:

```bash
# Use MongoDB
DB_TYPE=mongodb

# Use DynamoDB (original)
DB_TYPE=dynamodb
```

## 📊 Benefits of MongoDB

✅ **No AWS credentials needed**
✅ **Works with any hosting platform**
✅ **Free tier available (512MB)**
✅ **Easier queries and debugging**
✅ **Better development tools**
✅ **More flexible schema**

## 🛠 MongoDB Tools

- **MongoDB Compass**: GUI for viewing and managing data
- **MongoDB Atlas Dashboard**: Web interface for cloud databases
- **VS Code Extension**: MongoDB for VS Code

## 🚨 Migration Notes

- Your existing DynamoDB data won't be automatically migrated
- Both databases can run simultaneously during transition
- API endpoints remain the same - only the storage backend changes
- MongoDB uses different ID formats (ObjectId vs custom strings)

Ready to use MongoDB! 🎉