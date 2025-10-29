@echo off
echo 📦 Creating Lambda Deployment Package
echo ====================================

echo 🔍 Checking if dependencies are installed...
if not exist "node_modules" (
    echo 📥 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencies already installed
)

echo 📁 Creating deployment directory...
if exist "deployment" rmdir /s /q deployment
mkdir deployment

echo 📋 Copying files...
copy index.mjs deployment\
copy package.json deployment\
xcopy /s /e /i node_modules deployment\node_modules

echo 🗜️ Creating ZIP file...
cd deployment
powershell -command "Compress-Archive -Path * -DestinationPath ..\lambda-deployment.zip -Force"
cd ..

echo 🧹 Cleaning up...
rmdir /s /q deployment

echo ✅ Lambda deployment package created: lambda-deployment.zip
echo 📊 Package size:
for %%A in (lambda-deployment.zip) do echo    Size: %%~zA bytes

echo.
echo 📝 Next steps:
echo 1. Go to AWS Lambda Console
echo 2. Create new function or update existing
echo 3. Upload lambda-deployment.zip
echo 4. Set handler to: index.handler
echo 5. Configure environment variables
echo 6. Test the function

pause