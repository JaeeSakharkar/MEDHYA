# 🚀 Alternative Deployment Options for AWS Academy Lab

## ⚠️ AWS Academy Lab Limitations

Your AWS Academy Lab role (`voclabs/user4257726`) has restricted permissions and cannot create Amplify apps. Here are alternative deployment strategies that work with lab roles.

## 🎯 Recommended Options for Lab Environment

### Option 1: S3 Static Website + API Gateway (Best for Labs)

#### Frontend: S3 Static Website Hosting
```bash
# 1. Build your frontend
cd frontend
npm run build

# 2. Create S3 bucket (via AWS Console or CLI)
aws s3 mb s3://quizmaster-v2-frontend-bucket

# 3. Enable static website hosting
aws s3 website s3://quizmaster-v2-frontend-bucket --index-document index.html --error-document index.html

# 4. Upload files
aws s3 sync dist/ s3://quizmaster-v2-frontend-bucket --delete

# 5. Make bucket public (set bucket policy)
```

**S3 Bucket Policy** (replace bucket name):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::quizmaster-v2-frontend-bucket/*"
        }
    ]
}
```

#### Backend: Lambda + API Gateway
```bash
# 1. Install Serverless Framework
npm install -g serverless

# 2. Deploy backend
cd backend-vite
serverless deploy
```

### Option 2: EC2 Instance (Full Control)

#### Deploy Both Frontend & Backend on EC2
```bash
# 1. Launch EC2 instance (t2.micro for free tier)
# 2. Connect via SSH
# 3. Install Node.js and nginx
sudo yum update -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# 4. Install nginx
sudo yum install nginx -y

# 5. Clone your repository
git clone https://github.com/your-username/quizmaster-v2.git
cd quizmaster-v2

# 6. Setup frontend
cd frontend
npm install
npm run build

# 7. Setup backend
cd ../backend-vite
npm install
npm start &

# 8. Configure nginx
sudo nano /etc/nginx/nginx.conf
```

### Option 3: Netlify + Railway/Render (External Services)

#### Frontend: Netlify (Free)
1. **Go to [Netlify](https://netlify.com)**
2. **Connect GitHub repository**
3. **Build settings**:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`

#### Backend: Railway (Free tier)
1. **Go to [Railway](https://railway.app)**
2. **Connect GitHub repository**
3. **Deploy backend-vite folder**

### Option 4: GitHub Pages + Vercel

#### Frontend: GitHub Pages
```bash
# 1. Install gh-pages
cd frontend
npm install --save-dev gh-pages

# 2. Add to package.json
"homepage": "https://yourusername.github.io/quizmaster-v2",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# 3. Deploy
npm run deploy
```

## 🛠️ Lab-Compatible Setup Scripts

### S3 + Lambda Deployment Script
```bash
#!/bin/bash

echo "🚀 Deploying QuizMaster V2 to AWS Lab Environment"

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

# Create S3 bucket
BUCKET_NAME="quizmaster-v2-$(date +%s)"
echo "🪣 Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Upload frontend files
echo "📤 Uploading frontend files..."
aws s3 sync frontend/dist/ s3://$BUCKET_NAME --delete

# Deploy backend to Lambda
echo "🚀 Deploying backend to Lambda..."
cd backend-vite
serverless deploy

echo "✅ Deployment complete!"
echo "🌐 Frontend URL: http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
```

### EC2 Setup Script
```bash
#!/bin/bash

# EC2 User Data Script
yum update -y
yum install -y git nginx

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18
nvm use 18

# Clone repository
cd /home/ec2-user
git clone https://github.com/your-username/quizmaster-v2.git
chown -R ec2-user:ec2-user quizmaster-v2

# Setup application
cd quizmaster-v2/frontend
npm install
npm run build

cd ../backend-vite
npm install

# Start backend
nohup npm start > /var/log/quizmaster-backend.log 2>&1 &

# Configure nginx
cat > /etc/nginx/conf.d/quizmaster.conf << 'EOF'
server {
    listen 80;
    server_name _;
    
    # Serve frontend
    location / {
        root /home/ec2-user/quizmaster-v2/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Start nginx
systemctl start nginx
systemctl enable nginx
```

## 🔧 Lab-Specific Configuration Files

### Serverless.yml for Lab Environment
```yaml
service: quizmaster-backend-lab

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  stage: lab
  
  # Use lab role permissions
  deploymentBucket:
    name: ${self:service}-${self:provider.stage}-deployments
    
  environment:
    NODE_ENV: production
    COGNITO_POOL_ID: us-east-1_RsOYVRSJu
    COGNITO_CLIENT_ID: 6npa9g9it0o66diikabm29j9je
    COGNITO_REGION: us-east-1
    COGNITO_DOMAIN: medhya.auth.us-east-1.amazoncognito.com

functions:
  api:
    handler: src/lambda.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
      - http:
          path: /
          method: ANY
          cors: true

plugins:
  - serverless-offline
```

### Frontend Environment for Lab
```env
# frontend/.env.lab
VITE_COGNITO_DOMAIN=medhya.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=6npa9g9it0o66diikabm29j9je
VITE_REDIRECT_URI=http://your-s3-bucket.s3-website-us-east-1.amazonaws.com/callback
VITE_LOGOUT_URI=http://your-s3-bucket.s3-website-us-east-1.amazonaws.com/login
VITE_API_BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/lab
```

## 🚀 Quick Lab Deployment Commands

### Option 1: S3 + Lambda (Recommended for Labs)
```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Create and configure S3 bucket via AWS Console
# 3. Upload dist/ folder contents to S3
# 4. Deploy backend
cd ../backend-vite
npm install -g serverless
serverless deploy
```

### Option 2: EC2 All-in-One
```bash
# 1. Launch EC2 instance with the user data script above
# 2. Wait for setup to complete
# 3. Access via EC2 public IP
```

### Option 3: External Services (No AWS limits)
```bash
# 1. Push code to GitHub
# 2. Deploy frontend to Netlify
# 3. Deploy backend to Railway/Render
# 4. Update environment variables
```

## 📋 Lab Deployment Checklist

- [ ] ✅ Choose deployment option based on lab permissions
- [ ] ✅ Build frontend: `npm run build`
- [ ] ✅ Test locally before deployment
- [ ] ✅ Update Cognito callback URLs after deployment
- [ ] ✅ Configure CORS for production domain
- [ ] ✅ Test authentication flow
- [ ] ✅ Monitor application logs

## 🎯 Recommended Path for AWS Academy Lab

**Use S3 + Lambda approach:**
1. Deploy frontend to S3 static website
2. Deploy backend using Serverless Framework
3. Update Cognito URLs
4. Test complete application

This gives you a production-ready deployment within lab constraints! 🚀