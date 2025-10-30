// Quiz Model: MongoDB version using Mongoose
const Quiz = require('../schemas/Quiz');

/**
 * List all quizzes in the database.
 */
async function listQuizzes() {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    // Transform data to match frontend expectations
    return quizzes.map(q => ({
      id: parseInt(q.id.replace('quiz-', '').replace('test-quiz-', '')) || q.id,
      title: q.title,
      subject: q.chapterId || 'General', // Frontend expects 'subject'
      description: q.description,
      chapterId: q.chapterId,
      createdAt: q.createdAt
    }));
  } catch (error) {
    throw new Error(`Failed to list quizzes: ${error.message}`);
  }
}

/**
 * Create a new quiz.
 */
async function createQuiz(quiz) {
  try {
    const newQuiz = new Quiz({
      id: quiz.id || `quiz-${Date.now()}`, // Generate ID if not provided
      title: quiz.title,
      description: quiz.description,
      chapterId: quiz.chapterId || quiz.subjectId || 'general',
      createdAt: new Date()
    });
    const savedQuiz = await newQuiz.save();
    
    // Transform data to match frontend expectations
    return {
      id: parseInt(savedQuiz.id.replace('quiz-', '').replace('test-quiz-', '')) || savedQuiz.id,
      title: savedQuiz.title,
      subject: savedQuiz.chapterId || 'General',
      description: savedQuiz.description,
      chapterId: savedQuiz.chapterId,
      createdAt: savedQuiz.createdAt
    };
  } catch (error) {
    throw new Error(`Failed to create quiz: ${error.message}`);
  }
}

/**
 * Get a single quiz by id.
 */
async function getQuiz(id) {
  try {
    const q = await Quiz.findOne({ id });
    if (!q) return null;
    
    // Transform data to match frontend expectations
    return {
      id: parseInt(q.id.replace('quiz-', '').replace('test-quiz-', '')) || q.id,
      title: q.title,
      subject: q.chapterId || 'General',
      description: q.description,
      chapterId: q.chapterId,
      createdAt: q.createdAt
    };
  } catch (error) {
    throw new Error(`Failed to get quiz: ${error.message}`);
  }
}

/**
 * Update quiz details.
 */
async function updateQuiz(id, updates) {
  try {
    const updatedQuiz = await Quiz.findOneAndUpdate(
      { id },
      { 
        title: updates.title,
        description: updates.description,
        chapterId: updates.chapterId || updates.subjectId,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedQuiz) return null;
    
    // Transform data to match frontend expectations
    return {
      id: parseInt(updatedQuiz.id.replace('quiz-', '').replace('test-quiz-', '')) || updatedQuiz.id,
      title: updatedQuiz.title,
      subject: updatedQuiz.chapterId || 'General',
      description: updatedQuiz.description,
      chapterId: updatedQuiz.chapterId,
      createdAt: updatedQuiz.createdAt
    };
  } catch (error) {
    throw new Error(`Failed to update quiz: ${error.message}`);
  }
}

/**
 * Delete quiz by id.
 */
async function deleteQuiz(id) {
  try {
    await Quiz.findOneAndDelete({ id });
    return true;
  } catch (error) {
    throw new Error(`Failed to delete quiz: ${error.message}`);
  }
}

module.exports = {
  listQuizzes,
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz
};