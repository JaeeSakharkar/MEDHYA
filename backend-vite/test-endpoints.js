// Lambda Endpoint Tester for QuizMaster V2
import https from 'https';
import { URL } from 'url';

// Configuration
const LAMBDA_URL = process.env.LAMBDA_URL || 'https://your-lambda-url.execute-api.us-east-1.amazonaws.com/prod';
const JWT_TOKEN = process.env.JWT_TOKEN || '';

// Test endpoints
const endpoints = [
  {
    name: 'Health Check',
    method: 'GET',
    path: '/',
    requiresAuth: false,
    description: 'Basic health check endpoint'
  },
  {
    name: 'Status Check',
    method: 'GET',
    path: '/status',
    requiresAuth: false,
    description: 'Detailed status information'
  },
  {
    name: 'Auth Test',
    method: 'GET',
    path: '/test-auth',
    requiresAuth: true,
    description: 'Test JWT authentication'
  },
  {
    name: 'Get Quizzes',
    method: 'GET',
    path: '/quizzes',
    requiresAuth: true,
    description: 'List all quizzes'
  },
  {
    name: 'Get User Profile',
    method: 'GET',
    path: '/users/profile',
    requiresAuth: true,
    description: 'Get current user profile'
  },
  {
    name: 'Get Scores',
    method: 'GET',
    path: '/scores',
    requiresAuth: true,
    description: 'Get user scores'
  }
];

// HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    
    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'QuizMaster-Lambda-Tester/1.0',
        ...options.headers
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test runner
async function runTests() {
  console.log('🧪 QuizMaster V2 Lambda Endpoint Tests');
  console.log('=====================================');
  console.log(`🔗 Lambda URL: ${LAMBDA_URL}`);
  console.log(`🔑 JWT Token: ${JWT_TOKEN ? 'Provided' : 'Not provided (auth tests will be skipped)'}`);
  console.log('');

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const endpoint of endpoints) {
    const testName = `${endpoint.method} ${endpoint.path}`;
    
    try {
      // Skip auth tests if no token provided
      if (endpoint.requiresAuth && !JWT_TOKEN) {
        console.log(`⏭️  SKIPPED: ${testName} - No JWT token provided`);
        skipped++;
        continue;
      }

      console.log(`🧪 Testing: ${testName}`);
      console.log(`   Description: ${endpoint.description}`);

      const options = {
        method: endpoint.method,
        headers: {}
      };

      if (endpoint.requiresAuth) {
        options.headers['Authorization'] = `Bearer ${JWT_TOKEN}`;
      }

      const response = await makeRequest(`${LAMBDA_URL}${endpoint.path}`, options);
      
      // Check if response is successful
      const isSuccess = response.statusCode >= 200 && response.statusCode < 300;
      
      if (isSuccess) {
        console.log(`   ✅ PASSED: ${response.statusCode}`);
        console.log(`   📄 Response: ${JSON.stringify(response.body, null, 2).substring(0, 200)}...`);
        passed++;
      } else {
        console.log(`   ❌ FAILED: ${response.statusCode}`);
        console.log(`   📄 Response: ${JSON.stringify(response.body, null, 2)}`);
        failed++;
      }
      
    } catch (error) {
      console.log(`   💥 ERROR: ${error.message}`);
      failed++;
    }
    
    console.log('');
  }

  // Summary
  console.log('📊 Test Summary');
  console.log('===============');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`📈 Total: ${passed + failed + skipped}`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Your Lambda is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }

  // Next steps
  console.log('');
  console.log('📝 Next Steps:');
  console.log('1. If health checks pass: Lambda deployment is successful');
  console.log('2. If auth tests pass: Cognito integration is working');
  console.log('3. Update frontend VITE_API_BASE_URL to your Lambda URL');
  console.log('4. Test the complete application flow');
}

// Run tests
if (process.argv[2] === '--help') {
  console.log('QuizMaster V2 Lambda Endpoint Tester');
  console.log('');
  console.log('Usage:');
  console.log('  node test-endpoints.js');
  console.log('  LAMBDA_URL=https://your-url.com JWT_TOKEN=your-token node test-endpoints.js');
  console.log('');
  console.log('Environment Variables:');
  console.log('  LAMBDA_URL - Your Lambda API Gateway URL');
  console.log('  JWT_TOKEN  - Your Cognito JWT token (optional)');
} else {
  runTests().catch(console.error);
}