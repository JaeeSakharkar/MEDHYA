@echo off
echo ========================================
echo   QuizMaster V2 - S3 Database Deployment
echo ========================================
echo.

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: AWS CLI is not installed or not in PATH
    echo Please install AWS CLI first: https://aws.amazon.com/cli/
    pause
    exit /b 1
)

REM Set your S3 bucket names here
set DATA_BUCKET=your-quizmaster-data-bucket
set APP_BUCKET=your-quizmaster-app-bucket

echo Step 1: Uploading database files to S3...
echo Bucket: %DATA_BUCKET%
echo.

REM Upload JSON database files
aws s3 cp s3-data/quizzes.json s3://%DATA_BUCKET%/data/quizzes.json
aws s3 cp s3-data/questions.json s3://%DATA_BUCKET%/data/questions.json  
aws s3 cp s3-data/scores.json s3://%DATA_BUCKET%/data/scores.json
aws s3 cp s3-data/users.json s3://%DATA_BUCKET%/data/users.json

if %errorlevel% neq 0 (
    echo ERROR: Failed to upload database files
    pause
    exit /b 1
)

echo.
echo Step 2: Building frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

echo.
echo Step 3: Uploading frontend to S3...
echo Bucket: %APP_BUCKET%
echo.

REM Upload frontend files
aws s3 sync dist/ s3://%APP_BUCKET%/ --delete

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Deployment Successful!
    echo ========================================
    echo.
    echo Database API: https://%DATA_BUCKET%.s3.amazonaws.com/data/
    echo Frontend App: http://%APP_BUCKET%.s3-website-us-east-1.amazonaws.com
    echo.
    echo Next steps:
    echo 1. Update frontend/src/services/s3Storage.ts with your bucket URLs
    echo 2. Configure Cognito redirect URLs
    echo 3. Test the application
    echo.
) else (
    echo.
    echo ERROR: Deployment failed
    echo Please check your AWS credentials and bucket permissions
)

cd ..
pause