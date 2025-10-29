// Verify frontend Cognito configuration
import fs from 'fs';
import path from 'path';

console.log('=== Frontend Cognito Configuration Verification ===\n');

// Read .env file
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found');
  console.log('📝 Create a .env file in the frontend directory with:');
  console.log('VITE_COGNITO_DOMAIN=medhya.auth.us-east-1.amazoncognito.com');
  console.log('VITE_COGNITO_CLIENT_ID=6npa9g9it0o66diikabm29j9je');
  console.log('VITE_REDIRECT_URI=http://localhost:8080/callback');
  console.log('VITE_LOGOUT_URI=http://localhost:8080/login');
  console.log('VITE_API_BASE_URL=http://localhost:5000');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

console.log('Environment variables found:');
console.log('✅ VITE_COGNITO_DOMAIN:', envVars.VITE_COGNITO_DOMAIN || '❌ Missing');
console.log('✅ VITE_COGNITO_CLIENT_ID:', envVars.VITE_COGNITO_CLIENT_ID || '❌ Missing');
console.log('✅ VITE_REDIRECT_URI:', envVars.VITE_REDIRECT_URI || '❌ Missing');
console.log('✅ VITE_LOGOUT_URI:', envVars.VITE_LOGOUT_URI || '❌ Missing');
console.log('✅ VITE_API_BASE_URL:', envVars.VITE_API_BASE_URL || '❌ Missing');

console.log('\n=== Expected Cognito URLs ===');
const domain = envVars.VITE_COGNITO_DOMAIN;
const clientId = envVars.VITE_COGNITO_CLIENT_ID;
const redirectUri = envVars.VITE_REDIRECT_URI;

if (domain && clientId && redirectUri) {
  console.log('Login URL:');
  console.log(`https://${domain}/login?client_id=${clientId}&response_type=token&scope=email+openid+phone&redirect_uri=${encodeURIComponent(redirectUri)}`);
  
  console.log('\nLogout URL:');
  console.log(`https://${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(envVars.VITE_LOGOUT_URI)}`);
} else {
  console.log('❌ Cannot generate URLs - missing required environment variables');
}

console.log('\n=== Verification Steps ===');
console.log('1. ✅ Check that your Cognito User Pool allows these callback URLs');
console.log('2. ✅ Ensure OAuth flows include "Implicit grant"');
console.log('3. ✅ Verify scopes include: email, openid, phone');
console.log('4. ✅ Make sure backend is running on port 5000');
console.log('5. ✅ Frontend should run on port 8080');