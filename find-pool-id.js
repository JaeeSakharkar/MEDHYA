// Script to help find your Cognito User Pool ID
console.log('=== How to Find Your Cognito User Pool ID ===\n');

console.log('🔍 Method 1: AWS Console');
console.log('1. Go to https://console.aws.amazon.com/cognito/');
console.log('2. Click "User pools"');
console.log('3. Find your pool (likely named "medhya" or similar)');
console.log('4. Click on it');
console.log('5. Look for "User pool ID" - it looks like: us-east-1_AbCdEfGhI');

console.log('\n🔍 Method 2: AWS CLI (if you have it installed)');
console.log('aws cognito-idp list-user-pools --max-items 10 --region us-east-1');

console.log('\n🔍 Method 3: Check your Cognito domain');
console.log('Your domain: medhya.auth.us-east-1.amazoncognito.com');
console.log('The User Pool ID is usually related to the domain name.');

console.log('\n📝 Once you find it:');
console.log('1. Open backend/.env');
console.log('2. Replace "us-east-1_XXXXXXXXX" with your actual User Pool ID');
console.log('3. It should look like: COGNITO_POOL_ID=us-east-1_AbCdEfGhI');

console.log('\n⚠️  Common User Pool ID formats:');
console.log('- us-east-1_123456789 (9 characters after underscore)');
console.log('- us-east-1_AbCdEfGhI (9 mixed case characters)');
console.log('- Always starts with the region (us-east-1_)');

console.log('\n🚀 After updating:');
console.log('1. Run: node test-cognito.js');
console.log('2. You should see "✅ JWKS endpoint is accessible"');
console.log('3. Then start your backend: npm run dev');
console.log('4. Then start your frontend: npm run dev');