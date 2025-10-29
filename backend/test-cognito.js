// Test script to help debug Cognito configuration
require('dotenv').config();

console.log('=== Cognito Configuration Test ===');
console.log('COGNITO_POOL_ID:', process.env.COGNITO_POOL_ID);
console.log('COGNITO_CLIENT_ID:', process.env.COGNITO_CLIENT_ID);
console.log('COGNITO_REGION:', process.env.COGNITO_REGION);

// Construct JWKS URI
const jwksUri = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_POOL_ID}/.well-known/jwks.json`;
console.log('\nJWKS URI:', jwksUri);

// Test JWKS endpoint
const https = require('https');

console.log('\nTesting JWKS endpoint...');
https.get(jwksUri, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ JWKS endpoint is accessible');
      try {
        const jwks = JSON.parse(data);
        console.log('✅ JWKS response is valid JSON');
        console.log('Keys found:', jwks.keys?.length || 0);
      } catch (e) {
        console.log('❌ JWKS response is not valid JSON');
      }
    } else {
      console.log('❌ JWKS endpoint returned status:', res.statusCode);
      console.log('Response:', data);
    }
  });
}).on('error', (err) => {
  console.log('❌ Error accessing JWKS endpoint:', err.message);
  console.log('\n🔍 This usually means:');
  console.log('1. COGNITO_POOL_ID is incorrect');
  console.log('2. COGNITO_REGION is incorrect');
  console.log('3. User Pool does not exist');
  console.log('\n📝 To find your User Pool ID:');
  console.log('1. Go to AWS Cognito Console');
  console.log('2. Click on your User Pool');
  console.log('3. Look for "User pool ID" in the General settings');
  console.log('4. It should look like: us-east-1_AbCdEfGhI');
});

console.log('\n=== Frontend Configuration ===');
console.log('Current frontend .env values:');
console.log('VITE_COGNITO_DOMAIN=medhya.auth.us-east-1.amazoncognito.com');
console.log('VITE_COGNITO_CLIENT_ID=6npa9g9it0o66diikabm29j9je');
console.log('VITE_REDIRECT_URI=http://localhost:8081/callback');
console.log('VITE_LOGOUT_URI=http://localhost:8081/login');
console.log('VITE_API_BASE_URL=http://localhost:5000');

console.log('\n=== Test URLs ===');
console.log('Frontend: http://localhost:8081');
console.log('Backend: http://localhost:5000');
console.log('Login URL: https://medhya.auth.us-east-1.amazoncognito.com/login?client_id=6npa9g9it0o66diikabm29j9je&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A8081%2Fcallback');