@echo off
echo 🌐 API Gateway Setup Helper
echo ==========================

echo 📋 Step-by-Step Instructions:
echo.

echo 1. 🌐 Go to API Gateway Console:
echo    https://console.aws.amazon.com/apigateway/
echo.

echo 2. 🆕 Create New API:
echo    - Click "Create API"
echo    - Choose "REST API" (Build)
echo    - API name: quizmaster-api
echo    - Endpoint type: Regional
echo    - Click "Create API"
echo.

echo 3. 📁 Create Proxy Resource:
echo    - Click "Actions" → "Create Resource"
echo    - Resource Name: proxy
echo    - Resource Path: {proxy+}
echo    - ✅ Check "Configure as proxy resource"
echo    - ✅ Check "Enable API Gateway CORS"
echo    - Click "Create Resource"
echo.

echo 4. 🔗 Create ANY Method:
echo    - Select the {proxy+} resource
echo    - Click "Actions" → "Create Method"
echo    - Choose "ANY"
echo    - Click ✓ (checkmark)
echo.

echo 5. ⚙️ Configure Lambda Integration:
echo    - Integration type: Lambda Function
echo    - ✅ Check "Use Lambda Proxy integration"
echo    - Lambda Region: us-east-1
echo    - Lambda Function: quizmaster-backend
echo    - Click "Save"
echo    - Click "OK" to grant permissions
echo.

echo 6. 🔄 Enable CORS:
echo    - Select {proxy+} resource
echo    - Click "Actions" → "Enable CORS"
echo    - Access-Control-Allow-Origin: *
echo    - Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With
echo    - Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
echo    - Click "Enable CORS and replace existing CORS headers"
echo.

echo 7. 🚀 Deploy API:
echo    - Click "Actions" → "Deploy API"
echo    - Deployment stage: prod
echo    - Click "Deploy"
echo.

echo 8. 📋 Get Your API URL:
echo    - Copy the "Invoke URL" (looks like: https://abc123.execute-api.us-east-1.amazonaws.com/prod)
echo.

echo 9. 🧪 Test Your API:
set /p API_URL="Enter your API Gateway URL (or press Enter to skip test): "

if not "%API_URL%"=="" (
    echo.
    echo 🧪 Testing API Gateway...
    echo.
    
    echo Testing health check:
    curl -s "%API_URL%/"
    echo.
    
    echo Testing status:
    curl -s "%API_URL%/status"
    echo.
    
    echo ✅ If you see JSON responses above, your API Gateway is working!
) else (
    echo ⏭️ Skipping test - you can test later with:
    echo curl https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/
)

echo.
echo 📝 Next Steps:
echo 1. Update your frontend VITE_API_BASE_URL with the API Gateway URL
echo 2. Update Cognito callback URLs if needed
echo 3. Test the complete application flow
echo.

echo 🎉 Your API Gateway setup is complete!
pause