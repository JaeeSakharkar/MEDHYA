// Mock database for development - replace with real DynamoDB in production
const mockData = {
  quizzes: [
    { id: '1', title: 'JavaScript Basics', subject: 'Programming', description: 'Test your JavaScript knowledge' },
    { id: '2', title: 'React Fundamentals', subject: 'Programming', description: 'Learn React basics' },
    { id: '3', title: 'AWS Services', subject: 'Cloud', description: 'AWS core services quiz' }
  ],
  questions: [
    { id: '1', quizId: '1', question: 'What is JavaScript?', options: ['Programming language', 'Database', 'Operating system', 'Web browser'], correctAnswer: 0 },
    { id: '2', quizId: '1', question: 'What does DOM stand for?', options: ['Document Object Model', 'Data Object Management', 'Dynamic Object Method', 'Database Object Model'], correctAnswer: 0 },
    { id: '3', quizId: '2', question: 'What is React?', options: ['Library', 'Framework', 'Language', 'Database'], correctAnswer: 0 }
  ],
  scores: [],
  chapters: [
    { id: '1', subjectId: 'programming', title: 'Variables and Functions', description: 'Learn about variables and functions' },
    { id: '2', subjectId: 'programming', title: 'Objects and Arrays', description: 'Working with objects and arrays' }
  ]
};

// Mock DynamoDB operations
export const mockDb = {
  // Query operation
  query: async (params) => {
    console.log('Mock DB Query:', params);
    
    if (params.KeyConditionExpression?.includes('SCORE#')) {
      // Return user scores
      const userId = params.ExpressionAttributeValues[':pk'].replace('USER#', '');
      return { Items: mockData.scores.filter(s => s.userId === userId) };
    }
    
    return { Items: [] };
  },

  // Get operation
  get: async (params) => {
    console.log('Mock DB Get:', params);
    return { Item: null };
  },

  // Put operation
  put: async (params) => {
    console.log('Mock DB Put:', params);
    
    if (params.Item.SK?.includes('SCORE#')) {
      // Add score
      mockData.scores.push({
        ...params.Item,
        userId: params.Item.PK.replace('USER#', '')
      });
    }
    
    return {};
  },

  // Scan operation
  scan: async (params) => {
    console.log('Mock DB Scan:', params);
    
    if (params.FilterExpression?.includes('SCORE#')) {
      return { Items: mockData.scores };
    }
    
    return { Items: [] };
  }
};

// Mock model functions
export const mockModels = {
  // Quiz model
  listQuizzes: async () => mockData.quizzes,
  getQuiz: async (id) => mockData.quizzes.find(q => q.id === id),
  createQuiz: async (quiz) => {
    const newQuiz = { ...quiz, id: Date.now().toString() };
    mockData.quizzes.push(newQuiz);
    return newQuiz;
  },
  updateQuiz: async (id, updates) => {
    const index = mockData.quizzes.findIndex(q => q.id === id);
    if (index >= 0) {
      mockData.quizzes[index] = { ...mockData.quizzes[index], ...updates };
      return mockData.quizzes[index];
    }
    return null;
  },
  deleteQuiz: async (id) => {
    const index = mockData.quizzes.findIndex(q => q.id === id);
    if (index >= 0) {
      mockData.quizzes.splice(index, 1);
    }
  },

  // Question model
  listQuestions: async (quizId) => mockData.questions.filter(q => q.quizId === quizId),
  getQuestion: async (id) => mockData.questions.find(q => q.id === id),
  createQuestion: async (quizId, question) => {
    const newQuestion = { ...question, id: Date.now().toString(), quizId };
    mockData.questions.push(newQuestion);
    return newQuestion;
  },
  updateQuestion: async (id, updates) => {
    const index = mockData.questions.findIndex(q => q.id === id);
    if (index >= 0) {
      mockData.questions[index] = { ...mockData.questions[index], ...updates };
      return mockData.questions[index];
    }
    return null;
  },
  deleteQuestion: async (id) => {
    const index = mockData.questions.findIndex(q => q.id === id);
    if (index >= 0) {
      mockData.questions.splice(index, 1);
    }
  },

  // Score model
  listScores: async (userId) => mockData.scores.filter(s => s.userId === userId),
  createScore: async (userId, quizId, scoreObj) => {
    const newScore = {
      id: Date.now().toString(),
      userId,
      quizId,
      score: scoreObj.score,
      totalQuestions: scoreObj.totalQuestions,
      attemptDate: new Date().toISOString()
    };
    mockData.scores.push(newScore);
    return newScore;
  },
  listAllScores: async () => mockData.scores,
  listScoresByQuiz: async (quizId) => mockData.scores.filter(s => s.quizId === quizId),

  // Chapter model
  listChapters: async (subjectId) => mockData.chapters.filter(c => c.subjectId === subjectId),
  createChapter: async (subjectId, chapter) => {
    const newChapter = { ...chapter, id: Date.now().toString(), subjectId };
    mockData.chapters.push(newChapter);
    return newChapter;
  },
  updateChapter: async (id, updates) => {
    const index = mockData.chapters.findIndex(c => c.id === id);
    if (index >= 0) {
      mockData.chapters[index] = { ...mockData.chapters[index], ...updates };
      return mockData.chapters[index];
    }
    return null;
  },
  deleteChapter: async (id) => {
    const index = mockData.chapters.findIndex(c => c.id === id);
    if (index >= 0) {
      mockData.chapters.splice(index, 1);
    }
  }
};