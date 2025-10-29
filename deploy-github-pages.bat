@echo off
echo ========================================
echo   QuizMaster V2 - GitHub Pages Deployment
echo ========================================
echo.

echo Step 1: Building frontend for production...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

echo.
echo Step 2: Creating docs folder for GitHub Pages...
cd ..

REM Remove existing docs folder
if exist docs rmdir /s /q docs

REM Create new docs folder
mkdir docs

REM Copy built files to docs
xcopy /E /I frontend\dist\* docs\

echo.
echo Step 3: Adding files to git...
git add docs/
git add .
git commit -m "Deploy to GitHub Pages - %date% %time%"

echo.
echo Step 4: Pushing to GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Deployment Successful!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Go to your GitHub repo → Settings → Pages
    echo 2. Set source to "Deploy from a branch"
    echo 3. Select branch "main" and folder "/docs"
    echo 4. Your app will be available at:
    echo    https://your-username.github.io/your-repo-name/
    echo.
    echo 5. Update Cognito redirect URLs with your GitHub Pages URL
    echo.
) else (
    echo.
    echo ERROR: Failed to push to GitHub
    echo Please check your git configuration
)

pause