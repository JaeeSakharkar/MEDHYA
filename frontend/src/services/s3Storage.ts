// S3-based storage service for QuizMaster V2
// Uses S3 to store JSON files as database tables

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Score {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  attemptDate: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  groups: string[];
}

// S3 configuration
const S3_CONFIG = {
  BUCKET_NAME: 'your-quizmaster-data-bucket', // Change this to your bucket name
  BASE_URL: 'https://your-quizmaster-data-bucket.s3.amazonaws.com', // Change this to your bucket URL
  FILES: {
    QUIZZES: 'data/quizzes.json',
    QUESTIONS: 'data/questions.json',
    SCORES: 'data/scores.json',
    USERS: 'data/users.json'
  }
};

// Helper function to fetch JSON from S3
async function fetchFromS3<T>(fileName: string): Promise<T[]> {
  try {
    const response = await fetch(`${S3_CONFIG.BASE_URL}/${fileName}`);
    if (!response.ok) {
      if (response.status === 404) {
        // File doesn't exist yet, return empty array
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch ${fileName}, using empty array:`, error);
    return [];
  }
}

// Helper function to save JSON to S3 (requires CORS and public write access)
async function saveToS3<T>(fileName: string, data: T[]): Promise<void> {
  try {
    // For now, we'll use localStorage as fallback since S3 PUT requires authentication
    // In production, you'd need a backend API or signed URLs for writes
    const key = `s3_${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;
    localStorage.setItem(key, JSON.stringify(data));
    
    // TODO: Implement S3 PUT with signed URLs or backend API
    console.log(`Data saved locally for ${fileName} (S3 write not implemented yet)`);
  } catch (error) {
    console.error(`Failed to save ${fileName}:`, error);
    throw error;
  }
}

// Helper function to get data (try S3 first, fallback to localStorage)
async function getData<T>(fileName: string): Promise<T[]> {
  // Try localStorage first (for writes)
  const key = `s3_${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const localData = localStorage.getItem(key);
  
  if (localData) {
    return JSON.parse(localData);
  }
  
  // Fallback to S3 (for initial data)
  return await fetchFromS3<T>(fileName);
}

// Initialize with sample data
async function initializeData() {
  const quizzes = await getData<Quiz>(S3_CONFIG.FILES.QUIZZES);
  
  if (quizzes.length === 0) {
    const sampleQuizzes: Quiz[] = [
      {
        id: '1',
        title: 'JavaScript Basics',
        description: 'Test your JavaScript knowledge',
        subjectId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'React Fundamentals',
        description: 'Learn React basics',
        subjectId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    await saveToS3(S3_CONFIG.FILES.QUIZZES, sampleQuizzes);
  }
  
  const questions = await getData<Question>(S3_CONFIG.FILES.QUESTIONS);
  
  if (questions.length === 0) {
    const sampleQuestions: Question[] = [
      {
        id: '1',
        quizId: '1',
        question: 'What is JavaScript?',
        options: ['Programming language', 'Database', 'Operating system', 'Web browser'],
        correctAnswer: 0
      },
      {
        id: '2',
        quizId: '1',
        question: 'What does DOM stand for?',
        options: ['Document Object Model', 'Data Object Management', 'Dynamic Object Method', 'Database Object Model'],
        correctAnswer: 0
      }
    ];
    
    await saveToS3(S3_CONFIG.FILES.QUESTIONS, sampleQuestions);
  }
}

// Quiz operations
export const s3QuizStorage = {
  getAll: async (): Promise<Quiz[]> => {
    await initializeData();
    return await getData<Quiz>(S3_CONFIG.FILES.QUIZZES);
  },

  getById: async (id: string): Promise<Quiz | null> => {
    const quizzes = await s3QuizStorage.getAll();
    return quizzes.find(q => q.id === id) || null;
  },

  create: async (quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> => {
    const quizzes = await s3QuizStorage.getAll();
    const newQuiz: Quiz = {
      ...quiz,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    quizzes.push(newQuiz);
    await saveToS3(S3_CONFIG.FILES.QUIZZES, quizzes);
    return newQuiz;
  },

  update: async (id: string, updates: Partial<Quiz>): Promise<Quiz | null> => {
    const quizzes = await s3QuizStorage.getAll();
    const index = quizzes.findIndex(q => q.id === id);
    if (index === -1) return null;

    quizzes[index] = {
      ...quizzes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await saveToS3(S3_CONFIG.FILES.QUIZZES, quizzes);
    return quizzes[index];
  },

  delete: async (id: string): Promise<boolean> => {
    const quizzes = await s3QuizStorage.getAll();
    const filtered = quizzes.filter(q => q.id !== id);
    await saveToS3(S3_CONFIG.FILES.QUIZZES, filtered);
    return filtered.length < quizzes.length;
  }
};

// Question operations
export const s3QuestionStorage = {
  getByQuizId: async (quizId: string): Promise<Question[]> => {
    const questions = await getData<Question>(S3_CONFIG.FILES.QUESTIONS);
    return questions.filter(q => q.quizId === quizId);
  },

  create: async (question: Omit<Question, 'id'>): Promise<Question> => {
    const questions = await getData<Question>(S3_CONFIG.FILES.QUESTIONS);
    const newQuestion: Question = {
      ...question,
      id: Date.now().toString()
    };
    questions.push(newQuestion);
    await saveToS3(S3_CONFIG.FILES.QUESTIONS, questions);
    return newQuestion;
  },

  update: async (id: string, updates: Partial<Question>): Promise<Question | null> => {
    const questions = await getData<Question>(S3_CONFIG.FILES.QUESTIONS);
    const index = questions.findIndex(q => q.id === id);
    if (index === -1) return null;

    questions[index] = { ...questions[index], ...updates };
    await saveToS3(S3_CONFIG.FILES.QUESTIONS, questions);
    return questions[index];
  },

  delete: async (id: string): Promise<boolean> => {
    const questions = await getData<Question>(S3_CONFIG.FILES.QUESTIONS);
    const filtered = questions.filter(q => q.id !== id);
    await saveToS3(S3_CONFIG.FILES.QUESTIONS, filtered);
    return filtered.length < questions.length;
  }
};

// Score operations
export const s3ScoreStorage = {
  getAll: async (): Promise<Score[]> => {
    return await getData<Score>(S3_CONFIG.FILES.SCORES);
  },

  getByUserId: async (userId: string): Promise<Score[]> => {
    const scores = await s3ScoreStorage.getAll();
    return scores.filter(s => s.userId === userId);
  },

  getByQuizId: async (quizId: string): Promise<Score[]> => {
    const scores = await s3ScoreStorage.getAll();
    return scores.filter(s => s.quizId === quizId);
  },

  create: async (score: Omit<Score, 'id' | 'attemptDate'>): Promise<Score> => {
    const scores = await s3ScoreStorage.getAll();
    const newScore: Score = {
      ...score,
      id: Date.now().toString(),
      attemptDate: new Date().toISOString()
    };
    scores.push(newScore);
    await saveToS3(S3_CONFIG.FILES.SCORES, scores);
    return newScore;
  }
};

// User operations
export const s3UserStorage = {
  getAll: async (): Promise<User[]> => {
    return await getData<User>(S3_CONFIG.FILES.USERS);
  },

  getById: async (id: string): Promise<User | null> => {
    const users = await s3UserStorage.getAll();
    return users.find(u => u.id === id) || null;
  },

  create: async (user: User): Promise<User> => {
    const users = await s3UserStorage.getAll();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    await saveToS3(S3_CONFIG.FILES.USERS, users);
    return user;
  }
};