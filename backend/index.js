// Load environment variables
require('dotenv').config();

// Core/third-party modules
const express = require('express');
const cors = require('cors');

// Auth middleware (Cognito JWT)
const authenticateJWT = require('./authMiddleware');

// Modular routes
const quizRoutes = require('./routes/quizRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const questionRoutes = require('./routes/questionRoutes');
const scoreRoutes = require('./routes/scoreRoutes');

// Notification util (outside models)
const { sendNotification } = require('./notification');

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Quiz Master V2 Express backend running!');
});

// REST API endpoints (modular routers)
app.use('/quizzes', quizRoutes);
app.use('/chapters', chapterRoutes);
app.use('/questions', questionRoutes);
app.use('/scores', scoreRoutes);

// Example notification endpoint
app.post('/notify', authenticateJWT, async (req, res) => {
  // Only Admin should be allowed to use this (add adminOnly middleware if needed!)
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
  console.log(`🚀 Server running on port ${PORT}`);
});
