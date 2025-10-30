// Test script to verify mock data functionality
// Run this in browser console on production site

console.log('🧪 Testing MEDHYA Mock Data...');

// Test if we're in production mode
const isProduction = window.location.hostname !== 'localhost';
console.log('Production mode:', isProduction);

// Test API base URL
const apiBaseUrl = import.meta?.env?.VITE_API_BASE_URL || 'unknown';
console.log('API Base URL:', apiBaseUrl);

// Test mock data endpoints
const testEndpoints = [
  '/quizzes',
  '/questions/1',
  '/questions/2',
  '/questions/3',
  '/scores/all',
  '/scores',
  '/chapters/medical-terminology',
  '/chapters/anatomy'
];

async function testMockData() {
  console.log('🚀 Starting mock data tests...');
  
  for (const endpoint of testEndpoints) {
    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`);
      const data = await response.json();
      
      console.log(`✅ ${endpoint}:`, {
        status: response.status,
        dataLength: Array.isArray(data) ? data.length : 'object',
        sample: Array.isArray(data) ? data[0] : data
      });
    } catch (error) {
      console.log(`❌ ${endpoint}:`, error.message);
    }
  }
  
  console.log('🎉 Mock data test completed!');
}

// Run tests if in production
if (isProduction) {
  testMockData();
} else {
  console.log('ℹ️ Run this script on the production site to test mock data');
}