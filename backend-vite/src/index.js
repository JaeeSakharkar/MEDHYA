// Lambda-optimized Express backend with ES modules
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

// Load environment variables
config();

// Debug environment variables
console.log('Environment variables loaded:');
console.log('COGNITO_REGION:', process.env.COGNITO_REGION);
console.log('COGNITO_POOL_ID:', process.env.COGNITO_POOL_ID);
console.log('COGNITO_CLIENT_ID:', process.env.COGNITO_CLIENT_ID);

// Import middleware
import { authenticateJWT, requireAdmin } from './middleware/auth.js';

// Import routes
import quizRoutes from './routes/quizRoutes.js';
import chapterRoutes from './routes/chapterRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import scoreRoutes from './routes/scoreRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Import utilities
import { sendNotification } from './utils/notification.js';

const app = express();

// Lambda-optimized CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all origins in development, specific origins in production
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:8081',
      'https://localhost:8080',
      'https://localhost:8081'
    ];
    
    // Add Amplify domains dynamically
    if (origin.includes('.amplifyapp.com') || 
        origin.includes('.s3-website') ||
        allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(null, true); // Allow all for now, restrict in production
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lambda health check middleware
app.use((req, res, next) => {
  // Add request ID for tracking
  req.requestId = req.lambda?.requestId || Math.random().toString(36).substr(2, 9);
  
  // Log request for debugging
  console.log(`[${req.requestId}] ${req.method} ${req.path}`, {
    headers: req.headers,
    query: req.query,
    body: req.method !== 'GET' ? req.body : undefined
  });
  
  next();
});

// Lambda health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'QuizMaster V2 Lambda Backend Running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    requestId: req.requestId,
    lambda: {
      functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
      functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
      region: process.env.AWS_REGION
    },
    database: process.env.DYNAMODB_TABLE ? 'DynamoDB' : 'Mock',
    cognito: {
      poolId: process.env.COGNITO_POOL_ID,
      region: process.env.COGNITO_REGION
    }
  });
});

// Test authentication endpoint
app.get('/test-auth', authenticateJWT, (req, res) => {
  res.json({
    message: 'Authentication successful!',
    requestId: req.requestId,
    user: {
      id: req.user.sub,
      email: req.user.email,
      groups: req.user['cognito:groups'] || [],
      isAdmin: (req.user['cognito:groups'] || []).includes('admin')
    },
    lambda: {
      functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
      requestId: req.lambda?.requestId
    }
  });
});

// API status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    requestId: req.requestId
  });
});

// REST API endpoints (modular routers)
app.use('/auth', authRoutes);
app.use('/quizzes', quizRoutes);
app.use('/chapters', chapterRoutes);
app.use('/questions', questionRoutes);
app.use('/scores', scoreRoutes);
app.use('/users', userRoutes);

// Profile endpoint (alias for user profile)
app.use('/profile', userRoutes);

// Example notification endpoint (Admin only)
app.post('/notify', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { message } = req.body;
    await sendNotification(message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notification.' });
  }
});

// Catch-all for 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

// Lambda doesn't need server listening
// Only start server if not in Lambda environment
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`🚀 QuizMaster V2 Backend Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/`);
    console.log(`🗄️ Database: ${process.env.DYNAMODB_TABLE ? 'DynamoDB' : 'Mock'}`);
  });
} else {
  console.log('🚀 QuizMaster V2 Lambda Backend initialized');
  console.log(`📍 Function: ${process.env.AWS_LAMBDA_FUNCTION_NAME}`);
  console.log(`🗄️ Database: ${process.env.DYNAMODB_TABLE ? 'DynamoDB' : 'Mock'}`);
}

// Export for Lambda and testing
export default app;