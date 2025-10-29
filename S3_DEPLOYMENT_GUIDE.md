# S3 Deployment Guide for QuizMaster V2

Since you're now using localStorage, you only need to deploy the frontend to S3. No backend infrastructure required!

## Prerequisites

1. **AWS Account** with S3 access
2. **AWS CLI** installed and configured
3. **S3 Bucket** created and configured for static website hosting

## Step 1: Create S3 Bucket

1. Go to AWS Console → S3
2. Create a new bucket (e.g., `quizmaster-v2-app`)
3. **Uncheck** "Block all public access"
4. Enable **Static website hosting**:
   - Index document: `index.html`
   - Error document: `index.html` (for SPA routing)

## Step 2: Configure Bucket Policy

Add this bucket policy (replace `your-bucket-name`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

## Step 3: Build and Deploy

### Option A: Manual Upload

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Upload all files from `frontend/dist/` to your S3 bucket root

### Option B: AWS CLI (Recommended)

1. Install AWS CLI: https://aws.amazon.com/cli/
2. Configure credentials: `aws configure`
3. Edit `deploy-s3.bat` and set your bucket name
4. Run: `deploy-s3.bat`

### Option C: AWS CLI Command

```bash
# Build frontend
cd frontend && npm run build

# Upload to S3 (replace bucket name)
aws s3 sync dist/ s3://your-bucket-name/ --delete
```

## Step 4: Update Cognito Redirect URLs

After deployment, update your Cognito App Client:

1. Go to AWS Console → Cognito → User Pools → Your Pool → App Integration
2. Edit App Client settings
3. Add your S3 website URL to:
   - **Callback URLs**: `http://your-bucket.s3-website-us-east-1.amazonaws.com/callback`
   - **Sign out URLs**: `http://your-bucket.s3-website-us-east-1.amazonaws.com/login`

## Step 5: Update Production Environment

Update `frontend/.env.production`:

```env
# Update with your actual S3 website URL
VITE_REDIRECT_URI=http://your-bucket.s3-website-us-east-1.amazonaws.com/callback
VITE_LOGOUT_URI=http://your-bucket.s3-website-us-east-1.amazonaws.com/login

# No backend needed - localStorage handles data
VITE_API_BASE_URL=http://localhost:5000
```

## Files to Upload to S3

Upload **ALL** files from `frontend/dist/`:

```
📁 S3 Bucket Root/
├── 📁 assets/
│   ├── index-[hash].js     (JavaScript bundle)
│   └── index-[hash].css    (CSS styles)
├── favicon.ico             (Website icon)
├── index.html             (Main HTML file)
├── placeholder.svg        (Placeholder image)
└── robots.txt            (SEO file)
```

## Optional: CloudFront CDN

For better performance and HTTPS:

1. Create CloudFront distribution
2. Set S3 bucket as origin
3. Set default root object: `index.html`
4. Configure custom error pages: 404 → `/index.html` (for SPA routing)
5. Update Cognito URLs to use CloudFront domain

## Testing

1. Visit your S3 website URL
2. Test login with Cognito
3. Create/edit quizzes (stored in localStorage)
4. Data persists across browser sessions

## Benefits of This Setup

✅ **No Backend Costs** - Only S3 storage costs
✅ **Fast Performance** - Static files served from S3/CloudFront
✅ **Simple Deployment** - Just upload built files
✅ **Secure Authentication** - Still uses AWS Cognito
✅ **Persistent Data** - localStorage survives browser sessions
✅ **Offline Capable** - Works without internet after first load

## Troubleshooting

- **404 Errors**: Ensure error document is set to `index.html`
- **Login Issues**: Check Cognito redirect URLs match your domain
- **CORS Errors**: Not applicable since no backend calls
- **Data Loss**: localStorage is per-domain, data stays in browser