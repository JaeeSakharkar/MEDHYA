#!/bin/bash

# QuizMaster V2 - AWS Academy Lab Deployment Script

echo "🎓 QuizMaster V2 - AWS Academy Lab Deployment"
echo "============================================="

# Check AWS credentials
echo "🔍 Checking AWS credentials..."
aws sts get-caller-identity

if [ $? -ne 0 ]; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

echo "📋 Lab-Compatible Deployment Options:"
echo "1. S3 Static Website + Lambda API (Recommended)"
echo "2. EC2 Instance (All-in-one)"
echo "3. External Services (Netlify + Railway)"

read -p "Choose deployment option (1-3): " choice

case $choice in
    1)
        echo "🎯 Deploying to S3 + Lambda..."
        
        # Build frontend
        echo "📦 Building frontend..."
        cd frontend
        npm run build
        cd ..
        
        # Create unique bucket name
        TIMESTAMP=$(date +%s)
        BUCKET_NAME="quizmaster-v2-lab-${TIMESTAMP}"
        
        echo "🪣 Creating S3 bucket: $BUCKET_NAME"
        aws s3 mb s3://$BUCKET_NAME
        
        if [ $? -ne 0 ]; then
            echo "❌ Failed to create S3 bucket. Check your lab permissions."
            exit 1
        fi
        
        # Enable static website hosting
        echo "🌐 Enabling static website hosting..."
        aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html
        
        # Create bucket policy for public access
        cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
EOF
        
        # Apply bucket policy
        aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
        rm bucket-policy.json
        
        # Upload frontend files
        echo "📤 Uploading frontend files..."
        aws s3 sync frontend/dist/ s3://$BUCKET_NAME --delete
        
        # Deploy backend to Lambda
        echo "🚀 Deploying backend to Lambda..."
        cd backend-vite
        
        # Install serverless if not present
        if ! command -v serverless &> /dev/null; then
            echo "📦 Installing Serverless Framework..."
            npm install -g serverless
        fi
        
        # Install dependencies
        npm install serverless-http
        
        # Deploy
        serverless deploy --stage lab
        
        cd ..
        
        # Get API Gateway URL
        API_URL=$(cd backend-vite && serverless info --stage lab | grep "endpoints:" -A 1 | tail -1 | awk '{print $2}')
        
        echo "✅ Deployment complete!"
        echo "🌐 Frontend URL: http://${BUCKET_NAME}.s3-website-us-east-1.amazonaws.com"
        echo "🔗 API URL: $API_URL"
        echo ""
        echo "📝 Next steps:"
        echo "1. Update Cognito callback URLs:"
        echo "   - Callback: http://${BUCKET_NAME}.s3-website-us-east-1.amazonaws.com/callback"
        echo "   - Logout: http://${BUCKET_NAME}.s3-website-us-east-1.amazonaws.com/login"
        echo "2. Update frontend environment variables with API URL: $API_URL"
        ;;
        
    2)
        echo "🎯 Preparing EC2 deployment..."
        
        # Build frontend
        cd frontend
        npm run build
        cd ..
        
        echo "✅ Frontend built successfully!"
        echo "📝 EC2 Deployment Steps:"
        echo "1. Launch EC2 instance (t2.micro recommended)"
        echo "2. Use Amazon Linux 2 AMI"
        echo "3. Add this User Data script:"
        echo ""
        cat << 'EOF'
#!/bin/bash
yum update -y
yum install -y git nginx

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18
nvm use 18

# Clone repository (replace with your repo URL)
cd /home/ec2-user
git clone https://github.com/your-username/quizmaster-v2.git
chown -R ec2-user:ec2-user quizmaster-v2

# Setup application
cd quizmaster-v2/frontend
npm install
npm run build

cd ../backend-vite
npm install
nohup npm start > /var/log/quizmaster-backend.log 2>&1 &

# Configure nginx
cat > /etc/nginx/conf.d/quizmaster.conf << 'NGINX_EOF'
server {
    listen 80;
    server_name _;
    
    location / {
        root /home/ec2-user/quizmaster-v2/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
NGINX_EOF

systemctl start nginx
systemctl enable nginx
EOF
        echo ""
        echo "4. Configure Security Group to allow HTTP (port 80)"
        echo "5. Access via EC2 public IP address"
        ;;
        
    3)
        echo "🎯 Preparing External Services deployment..."
        
        cd frontend
        npm run build
        cd ..
        
        echo "✅ Frontend built successfully!"
        echo "📝 External Deployment Steps:"
        echo ""
        echo "Frontend (Netlify):"
        echo "1. Go to https://netlify.com"
        echo "2. Connect GitHub repository"
        echo "3. Build settings:"
        echo "   - Build command: cd frontend && npm run build"
        echo "   - Publish directory: frontend/dist"
        echo ""
        echo "Backend (Railway):"
        echo "1. Go to https://railway.app"
        echo "2. Connect GitHub repository"
        echo "3. Deploy backend-vite folder"
        echo ""
        echo "Alternative Backend (Render):"
        echo "1. Go to https://render.com"
        echo "2. Connect GitHub repository"
        echo "3. Deploy as Web Service"
        echo "4. Build command: cd backend-vite && npm install"
        echo "5. Start command: cd backend-vite && npm start"
        ;;
        
    *)
        echo "❌ Invalid option selected"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment preparation complete!"
echo "📚 See ALTERNATIVE_DEPLOYMENT_OPTIONS.md for detailed instructions"