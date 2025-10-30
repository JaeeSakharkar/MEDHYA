// LocalStorage service for MEDHYA
// This replaces the backend database for local development

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

// Storage keys
const STORAGE_KEYS = {
  QUIZZES: 'medhya_quizzes',
  QUESTIONS: 'medhya_questions',
  SCORES: 'medhya_scores',
  USERS: 'medhya_users'
};

// Initialize with sample data if empty
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.QUIZZES)) {
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
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(sampleQuizzes));
  }

  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
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
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(sampleQuestions));
  }

  if (!localStorage.getItem(STORAGE_KEYS.SCORES)) {
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
}

// Quiz operations
export const quizStorage = {
  getAll: (): Quiz[] => {
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES) || '[]');
  },

  getById: (id: string): Quiz | null => {
    const quizzes = quizStorage.getAll();
    return quizzes.find(q => q.id === id) || null;
  },

  create: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Quiz => {
    const quizzes = quizStorage.getAll();
    const newQuiz: Quiz = {
      ...quiz,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    quizzes.push(newQuiz);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
    return newQuiz;
  },

  update: (id: string, updates: Partial<Quiz>): Quiz | null => {
    const quizzes = quizStorage.getAll();
    const index = quizzes.findIndex(q => q.id === id);
    if (index === -1) return null;

    quizzes[index] = {
      ...quizzes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
    return quizzes[index];
  },

  delete: (id: string): boolean => {
    const quizzes = quizStorage.getAll();
    const filtered = quizzes.filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(filtered));
    return filtered.length < quizzes.length;
  }
};

// Question operations
export const questionStorage = {
  getByQuizId: (quizId: string): Question[] => {
    initializeStorage();
    const questions = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTIONS) || '[]');
    return questions.filter((q: Question) => q.quizId === quizId);
  },

  create: (question: Omit<Question, 'id'>): Question => {
    const questions = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTIONS) || '[]');
    const newQuestion: Question = {
      ...question,
      id: Date.now().toString()
    };
    questions.push(newQuestion);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    return newQuestion;
  },

  update: (id: string, updates: Partial<Question>): Question | null => {
    const questions = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTIONS) || '[]');
    const index = questions.findIndex((q: Question) => q.id === id);
    if (index === -1) return null;

    questions[index] = { ...questions[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    return questions[index];
  },

  delete: (id: string): boolean => {
    const questions = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTIONS) || '[]');
    const filtered = questions.filter((q: Question) => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(filtered));
    return filtered.length < questions.length;
  }
};

// Score operations
export const scoreStorage = {
  getAll: (): Score[] => {
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCORES) || '[]');
  },

  getByUserId: (userId: string): Score[] => {
    const scores = scoreStorage.getAll();
    return scores.filter(s => s.userId === userId);
  },

  getByQuizId: (quizId: string): Score[] => {
    const scores = scoreStorage.getAll();
    return scores.filter(s => s.quizId === quizId);
  },

  create: (score: Omit<Score, 'id' | 'attemptDate'>): Score => {
    const scores = scoreStorage.getAll();
    const newScore: Score = {
      ...score,
      id: Date.now().toString(),
      attemptDate: new Date().toISOString()
    };
    scores.push(newScore);
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
    return newScore;
  }
};

// User operations
export const userStorage = {
  getAll: (): User[] => {
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  getById: (id: string): User | null => {
    const users = userStorage.getAll();
    return users.find(u => u.id === id) || null;
  },

  create: (user: User): User => {
    const users = userStorage.getAll();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return user;
  }
};