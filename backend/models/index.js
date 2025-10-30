// Database adapter - switches between MongoDB and DynamoDB based on environment
const dbType = process.env.DB_TYPE || 'dynamodb';

let quizModel, chapterModel, questionModel, scoreModel;

if (dbType === 'mongodb') {
  console.log('🍃 Using MongoDB models');
  quizModel = require('./quizModel-mongo');
  chapterModel = require('./chapterModel-mongo');
  questionModel = require('./questionModel-mongo');
  scoreModel = require('./scoreModel-mongo');
} else {
  console.log('🔧 Using DynamoDB models');
  quizModel = require('./quizModel');
  chapterModel = require('./chapterModel');
  questionModel = require('./questionModel');
  scoreModel = require('./scoreModel');
}

module.exports = {
  quizModel,
  chapterModel,
  questionModel,
  scoreModel
};