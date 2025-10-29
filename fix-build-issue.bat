@echo off
echo ========================================
echo   Build Issue Fix Script
echo ========================================
echo.

echo Step 1: Cleaning node_modules and package-lock...
cd frontend
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo Step 2: Reinstalling dependencies...
npm install

echo.
echo Step 3: Checking environment variables...
echo VITE_COGNITO_DOMAIN=%VITE_COGNITO_DOMAIN%
echo VITE_COGNITO_CLIENT_ID=%VITE_COGNITO_CLIENT_ID%
echo VITE_REDIRECT_URI=%VITE_REDIRECT_URI%
echo VITE_LOGOUT_URI=%VITE_LOGOUT_URI%
echo VITE_API_BASE_URL=%VITE_API_BASE_URL%

echo.
echo Step 4: Building with verbose output...
npm run build -- --mode production

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Build Successful!
    echo ========================================
    echo.
    echo Files ready for deployment in dist/ folder
) else (
    echo.
    echo ========================================
    echo   Build Failed - Debugging
    echo ========================================
    echo.
    echo Trying alternative build approach...
    
    echo Creating minimal .env.production...
    echo VITE_COGNITO_DOMAIN=medhya.auth.us-east-1.amazoncognito.com > .env.production
    echo VITE_COGNITO_CLIENT_ID=6npa9g9it0o66diikabm29j9je >> .env.production
    echo VITE_REDIRECT_URI=https://main.your-app-id.amplifyapp.com/callback >> .env.production
    echo VITE_LOGOUT_URI=https://main.your-app-id.amplifyapp.com/login >> .env.production
    echo VITE_API_BASE_URL=https://p0r3ff73bh.execute-api.us-east-1.amazonaws.com/prod >> .env.production
    
    echo.
    echo Trying build again...
    npm run build
    
    if %errorlevel% equ 0 (
        echo Build successful with minimal .env!
    ) else (
        echo Build still failing. Check the error messages above.
        echo.
        echo Common fixes:
        echo 1. Remove any trailing spaces in .env files
        echo 2. Ensure all environment variables are properly quoted
        echo 3. Check for invisible characters in files
        echo 4. Try building in development mode: npm run build -- --mode development
    )
)

cd ..
pause