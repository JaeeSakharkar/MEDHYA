// Vite-powered Express backend with ES modules
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

// Load environment variables
config();

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

// Global middleware
app.use(cors());
app.use(express.json());

// Serve static files (for the backend info page)
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, 'public')));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'QuizMaster V2 Vite Backend Running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test authentication endpoint
app.get('/test-auth', authenticateJWT, (req, res) => {
  res.json({
    message: 'Authentication successful!',
    user: {
      id: req.user.sub,
      email: req.user.email,
      groups: req.user['cognito:groups'] || [],
      isAdmin: (req.user['cognito:groups'] || []).includes('admin')
    }
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

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Vite Backend Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/`);
});

// Export for potential testing
export default app;