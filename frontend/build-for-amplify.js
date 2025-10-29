#!/usr/bin/env node

// Build script for Amplify that creates clean environment variables
const fs = require('fs');
const path = require('path');

console.log('🔧 Creating clean environment variables for Amplify build...');

// Clean environment variables (no trailing spaces, no comments)
const envContent = `VITE_COGNITO_DOMAIN=medhya.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=6npa9g9it0o66diikabm29j9je
VITE_REDIRECT_URI=${process.env.AMPLIFY_APP_URL || 'https://main.d1234567890.amplifyapp.com'}/callback
VITE_LOGOUT_URI=${process.env.AMPLIFY_APP_URL || 'https://main.d1234567890.amplifyapp.com'}/login
VITE_API_BASE_URL=https://p0r3ff73bh.execute-api.us-east-1.amazonaws.com/prod
`;

// Write clean .env.production file
fs.writeFileSync('.env.production', envContent);

console.log('✅ Clean .env.production created:');
console.log(envContent);

console.log('🚀 Starting Vite build...');