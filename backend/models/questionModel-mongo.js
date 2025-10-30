// Question Model: MongoDB version using Mongoose
const Question = require('../schemas/Question');

/**
 * List all questions for a quiz
 */
async function listQuestions(quizId) {
  try {
    // Handle both formats: numeric ID and quiz-prefixed ID
    const searchQuizId = quizId.startsWith('quiz-') ? quizId : `quiz-${quizId}`;
    const questions = await Question.find({ quizId: searchQuizId }).sort({ createdAt: -1 });
    
    // Transform data to match frontend expectations
    return questions.map(q => ({
      id: parseInt(q.id.replace('q', '')) || q.id, // Convert q1, q2, etc. to numbers
      question: q.questionText, // Frontend expects 'question', not 'questionText'
      options: q.options,
      correctAnswer: q.correctAnswer,
      quizId: q.quizId,
      createdAt: q.createdAt
    }));
  } catch (error) {
    throw new Error(`Failed to list questions: ${error.message}`);
  }
}

/**
 * Create a question for a quiz
 */
async function createQuestion(quizId, question) {
  try {
    // Ensure quiz ID has the correct format
    const fullQuizId = quizId.startsWith('quiz-') ? quizId : `quiz-${quizId}`;
    
    const newQuestion = new Question({
      id: question.id || `q${Date.now()}`, // Generate ID if not provided
      quizId: fullQuizId,
      questionText: question.text || question.question, // Handle both formats
      options: question.options,
      correctAnswer: question.correctAnswer,
      createdAt: new Date()
    });
    const savedQuestion = await newQuestion.save();
    
    // Transform data to match frontend expectations
    return {
      id: parseInt(savedQuestion.id.replace('q', '')) || savedQuestion.id,
      question: savedQuestion.questionText,
      options: savedQuestion.options,
      correctAnswer: savedQuestion.correctAnswer,
      quizId: savedQuestion.quizId,
      createdAt: savedQuestion.createdAt
    };
  } catch (error) {
    throw new Error(`Failed to create question: ${error.message}`);
  }
}

/**
 * Get a question by id
 */
async function getQuestion(quizId, questionId) {
  try {
    // Handle both formats: numeric ID and quiz-prefixed ID
    const searchQuizId = quizId.startsWith('quiz-') ? quizId : `quiz-${quizId}`;
    const q = await Question.findOne({ quizId: searchQuizId, id: questionId });
    if (!q) return null;
    
    // Transform data to match frontend expectations
    return {
      id: parseInt(q.id.replace('q', '')) || q.id,
      question: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      quizId: q.quizId,
      createdAt: q.createdAt
    };
  } catch (error) {
    throw new Error(`Failed to get question: ${error.message}`);
  }
}

/**
 * Update a question
 */
async function updateQuestion(quizId, questionId, updates) {
  try {
    // Handle both formats: numeric ID and quiz-prefixed ID
    const searchQuizId = quizId.startsWith('quiz-') ? quizId : `quiz-${quizId}`;
    
    const updatedQuestion = await Question.findOneAndUpdate(
      { quizId: searchQuizId, id: questionId },
      {
        questionText: updates.text || updates.question,
        options: updates.options,
        correctAnswer: updates.correctAnswer,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedQuestion) return null;
    
    // Transform data to match frontend expectations
    return {
      id: parseInt(updatedQuestion.id.replace('q', '')) || updatedQuestion.id,
      question: updatedQuestion.questionText,
      options: updatedQuestion.options,
      correctAnswer: updatedQuestion.correctAnswer,
      quizId: updatedQuestion.quizId,
      createdAt: updatedQuestion.createdAt
    };
  } catch (error) {
    throw new Error(`Failed to update question: ${error.message}`);
  }
}

/**
 * Delete a question
 */
async function deleteQuestion(quizId, questionId) {
  try {
    // Handle both formats: numeric ID and quiz-prefixed ID
    const searchQuizId = quizId.startsWith('quiz-') ? quizId : `quiz-${quizId}`;
    await Question.findOneAndDelete({ quizId: searchQuizId, id: questionId });
    return true;
  } catch (error) {
    throw new Error(`Failed to delete question: ${error.message}`);
  }
}

module.exports = {
  listQuestions,
  createQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion
};