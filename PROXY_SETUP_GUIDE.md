# 🌐 API Gateway Proxy Setup for MEDHYA

## Current Issue
Your API Gateway proxy can't reach `localhost:5000` because it's running locally on your machine, but API Gateway is in AWS cloud.

## 🚀 Quick Solutions

### Option 1: Use ngrok (Fastest - 5 minutes)

1. **Install ngrok**
   ```bash
   # Download from https://ngrok.com/download
   # Or use chocolatey: choco install ngrok
   ```

2. **Expose your local backend**
   ```bash
   # In a new terminal, run:
   ngrok http 5000
   ```

3. **Copy the HTTPS URL**
   ```
   ngrok will show something like:
   https://abc123.ngrok.io -> http://localhost:5000
   ```

4. **Update API Gateway Proxy**
   - Go to AWS API Gateway Console
   - Find your proxy resource
   - Update the integration endpoint from `localhost:5000` to `https://abc123.ngrok.io`
   - Deploy the API

### Option 2: Deploy Backend to AWS (Recommended)

1. **Deploy to AWS Lambda**
   ```bash
   # Use Serverless Framework or AWS SAM
   serverless deploy
   ```

2. **Or Deploy to AWS App Runner**
   - Connect your GitHub repo
   - Set root directory to `backend`
   - Auto-deploys on push

3. **Update API Gateway**
   - Point to your deployed backend URL
   - No more localhost dependency

### Option 3: Use AWS EC2 (Traditional)

1. **Launch EC2 instance**
2. **Install Node.js and MongoDB**
3. **Deploy your backend**
4. **Update API Gateway to point to EC2 public IP**

## 🔧 Current API Gateway Configuration

Your API Gateway should be configured like this:

```
Resource: /{proxy+}
Method: ANY
Integration Type: HTTP Proxy
Endpoint URL: https://your-backend-url/{proxy}
```

## 🎯 Recommended Approach

**For immediate fix:**
1. Use ngrok to expose localhost:5000
2. Update API Gateway integration URL
3. Test your Amplify app

**For production:**
1. Deploy backend to AWS App Runner or Lambda
2. Update API Gateway to point to deployed backend
3. Remove ngrok dependency

## 📱 Testing Your Setup

After updating API Gateway:
1. Test the proxy URL directly: `https://p0r3ff73bh.execute-api.us-east-1.amazonaws.com/prod/quizzes`
2. Check your Amplify app
3. Verify CORS headers are working

## 🔒 Security Notes

- ngrok is for testing only
- Use HTTPS endpoints in production
- Configure proper CORS headers
- Secure your MongoDB connection string