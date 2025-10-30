// Load environment variables
require('dotenv').config();

// Core/third-party modules
const express = require('express');
const cors = require('cors');

// MongoDB connection
const connectDB = require('./mongodb');

// Auth middleware (Cognito JWT)
const { authenticateJWT, requireAdmin } = require('./authMiddleware');

// Modular routes
const quizRoutes = require('./routes/quizRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const questionRoutes = require('./routes/questionRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// Notification util (outside models)
const { sendNotification } = require('./notification');

const app = express();

// Connect to MongoDB (if using MongoDB)
if (process.env.DB_TYPE === 'mongodb') {
  connectDB();
}

// Global middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('MEDHYA Medical Education Platform backend running!');
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

// Test MongoDB endpoint (temporary - for testing only)
app.get('/test-mongodb', async (req, res) => {
  try {
    const { quizModel } = require('./models');
    const quizzes = await quizModel.listQuizzes();
    res.json({
      message: 'MongoDB connection successful!',
      totalQuizzes: quizzes.length,
      quizzes: quizzes
    });
  } catch (error) {
    res.status(500).json({
      error: 'MongoDB test failed',
      details: error.message
    });
  }
});

// Test create quiz endpoint (temporary - for testing only)
app.post('/test-create-quiz', async (req, res) => {
  try {
    const { quizModel } = require('./models');
    const testQuiz = {
      id: `test-quiz-${Date.now()}`,
      title: req.body.title || 'Test Quiz',
      description: req.body.description || 'This is a test quiz created via curl',
      chapterId: req.body.chapterId || 'test-chapter'
    };
    
    const result = await quizModel.createQuiz(testQuiz);
    res.status(201).json({
      message: 'Quiz created successfully in MongoDB!',
      quiz: result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create quiz',
      details: error.message
    });
  }
});

// Test create question endpoint (temporary - for testing only)
app.post('/test-create-question', async (req, res) => {
  try {
    const { questionModel } = require('./models');
    const { quizId, question } = req.body;
    
    const result = await questionModel.createQuestion(quizId, question);
    res.status(201).json({
      message: 'Question created successfully in MongoDB!',
      question: result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create question',
      details: error.message
    });
  }
});

// Test get questions for quiz endpoint
app.get('/test-questions/:quizId', async (req, res) => {
  try {
    const { questionModel } = require('./models');
    const { quizId } = req.params;
    
    const questions = await questionModel.listQuestions(quizId);
    res.json({
      message: 'Questions retrieved successfully!',
      totalQuestions: questions.length,
      questions: questions
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get questions',
      details: error.message
    });
  }
});

// Test scores endpoint
app.get('/test-scores', async (req, res) => {
  try {
    const { scoreModel } = require('./models');
    const allScores = await scoreModel.listAllScores();
    res.json({
      message: 'Scores retrieved successfully!',
      totalScores: allScores.length,
      scores: allScores
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get scores',
      details: error.message
    });
  }
});

// Test submit score endpoint
app.post('/test-submit-score', async (req, res) => {
  try {
    const { scoreModel } = require('./models');
    const { userId, quizId, score, totalQuestions } = req.body;
    
    const result = await scoreModel.createScore(
      userId || 'dev-user-123', 
      quizId, 
      { score, totalQuestions }
    );
    
    res.status(201).json({
      message: 'Score submitted successfully!',
      score: result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to submit score',
      details: error.message
    });
  }
});

// Test admin dashboard data endpoint
app.get('/test-admin-dashboard', async (req, res) => {
  try {
    const { quizModel, scoreModel } = require('./models');
    
    const [quizzes, scores] = await Promise.all([
      quizModel.listQuizzes(),
      scoreModel.listAllScores()
    ]);
    
    const stats = {
      totalQuizzes: quizzes.length,
      totalUsers: 3, // Mock user count
      totalAttempts: scores.length,
      avgScore: scores.length > 0 
        ? Math.round(scores.reduce((acc, s) => acc + (s.score / s.totalQuestions * 100), 0) / scores.length)
        : 0
    };
    
    res.json({
      message: 'Admin dashboard data retrieved successfully!',
      stats,
      quizzes: quizzes.slice(0, 3), // Show first 3 quizzes
      recentScores: scores.slice(0, 5) // Show last 5 scores
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get admin dashboard data',
      details: error.message
    });
  }
});

// Create complete quiz with questions endpoint
app.post('/test-create-complete-quiz', async (req, res) => {
  try {
    const { quizModel, questionModel } = require('./models');
    const { quiz, questions } = req.body;
    
    // Create the quiz first
    const quizId = `quiz-${Date.now()}`;
    const newQuiz = {
      id: quizId,
      title: quiz.title,
      description: quiz.description,
      chapterId: quiz.chapterId || 'general'
    };
    
    const createdQuiz = await quizModel.createQuiz(newQuiz);
    
    // Create all questions for the quiz
    const createdQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      const question = {
        id: `q${i + 1}`,
        text: questions[i].text,
        options: questions[i].options,
        correctAnswer: questions[i].correctAnswer
      };
      
      const createdQuestion = await questionModel.createQuestion(quizId, question);
      createdQuestions.push(createdQuestion);
    }
    
    res.status(201).json({
      message: 'Complete quiz created successfully in MongoDB!',
      quiz: createdQuiz,
      questions: createdQuestions,
      totalQuestions: createdQuestions.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create complete quiz',
      details: error.message
    });
  }
});

// REST API endpoints (modular routers)
app.use('/auth', authRoutes);
app.use('/quizzes', quizRoutes);
app.use('/chapters', chapterRoutes);
app.use('/questions', questionRoutes);
app.use('/scores', scoreRoutes);
app.use('/users', userRoutes);

// Public endpoints for testing (no authentication required)
app.get('/public/quizzes', async (req, res) => {
  try {
    const { quizModel } = require('./models');
    const quizzes = await quizModel.listQuizzes();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve quizzes.' });
  }
});

app.get('/public/quizzes/:id', async (req, res) => {
  try {
    const { quizModel } = require('./models');
    const { id } = req.params;
    const quiz = await quizModel.getQuiz(id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve quiz.' });
  }
});

app.get('/public/quizzes/:id/questions', async (req, res) => {
  try {
    const { questionModel } = require('./models');
    const { id } = req.params;
    const questions = await questionModel.listQuestions(id);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve questions.' });
  }
});

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
  console.log(`🚀 MEDHYA Server running on port ${PORT}`);
});
