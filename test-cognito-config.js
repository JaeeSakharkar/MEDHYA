// Test Cognito configuration
console.log('=== Cognito Configuration Test ===\n');

const config = {
  domain: 'medhya.auth.us-east-1.amazoncognito.com',
  clientId: '6npa9g9it0o66diikabm29j9je',
  poolId: 'us-east-1_RsOYVRSJu',
  region: 'us-east-1'
};

console.log('Configuration:');
console.log('Domain:', config.domain);
console.log('Client ID:', config.clientId);
console.log('Pool ID:', config.poolId);
console.log('Region:', config.region);

console.log('\n=== Test URLs ===');

const implicitUrl = `https://${config.domain}/login?client_id=${config.clientId}&response_type=token&scope=email+openid+phone&redirect_uri=${encodeURIComponent('http://localhost:8081/callback')}`;

const codeUrl = `https://${config.domain}/login?client_id=${config.clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent('http://localhost:8081/callback')}`;

console.log('Implicit Flow URL:');
console.log(implicitUrl);

console.log('\nAuthorization Code URL:');
console.log(codeUrl);

console.log('\n=== Required Cognito Settings ===');
console.log('✅ Allowed callback URLs must include: http://localhost:8081/callback');
console.log('✅ Allowed sign-out URLs must include: http://localhost:8081/login');
console.log('✅ OAuth 2.0 grant types must include: Implicit grant');
console.log('✅ OAuth scopes must include: email, openid, phone');

console.log('\n=== Next Steps ===');
console.log('1. Update your Cognito User Pool with the URLs above');
console.log('2. Try the implicit flow URL');
console.log('3. Check browser console for any errors');
console.log('4. If successful, you should be redirected to /callback with a token in the URL hash');