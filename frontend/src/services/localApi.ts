// Local API service using localStorage instead of backend
import { quizStorage, questionStorage, scoreStorage, userStorage, Quiz, Question, Score, User } from './localStorage';

// Simulate API delay for realistic experience
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

// Mock current user (you can get this from your auth context)
const getCurrentUser = (): User => {
  // This should come from your auth context
  return {
    id: 'current-user-id',
    email: 'user@example.com',
    name: 'Current User',
    groups: ['admin'] // Make user admin for testing
  };
};

// Quiz API
export const localQuizzesApi = {
  getAll: async (): Promise<Quiz[]> => {
    await delay();
    return quizStorage.getAll();
  },

  getById: async (id: string): Promise<Quiz | null> => {
    await delay();
    return quizStorage.getById(id);
  },

  create: async (data: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> => {
    await delay();
    return quizStorage.create(data);
  },

  update: async (id: string, data: Partial<Quiz>): Promise<Quiz | null> => {
    await delay();
    return quizStorage.update(id, data);
  },

  delete: async (id: string): Promise<boolean> => {
    await delay();
    return quizStorage.delete(id);
  }
};

// Questions API
export const localQuestionsApi = {
  getByQuiz: async (quizId: string): Promise<Question[]> => {
    await delay();
    return questionStorage.getByQuizId(quizId);
  },

  create: async (quizId: string, data: Omit<Question, 'id' | 'quizId'>): Promise<Question> => {
    await delay();
    return questionStorage.create({ ...data, quizId });
  },

  update: async (quizId: string, questionId: string, data: Partial<Question>): Promise<Question | null> => {
    await delay();
    return questionStorage.update(questionId, data);
  },

  delete: async (quizId: string, questionId: string): Promise<boolean> => {
    await delay();
    return questionStorage.delete(questionId);
  }
};

// Scores API
export const localScoresApi = {
  getMy: async (): Promise<Score[]> => {
    await delay();
    const currentUser = getCurrentUser();
    return scoreStorage.getByUserId(currentUser.id);
  },

  submit: async (data: { quizId: string; score: number; totalQuestions: number }): Promise<Score> => {
    await delay();
    const currentUser = getCurrentUser();
    return scoreStorage.create({
      userId: currentUser.id,
      quizId: data.quizId,
      score: data.score,
      totalQuestions: data.totalQuestions
    });
  },

  getAll: async (): Promise<Score[]> => {
    await delay();
    return scoreStorage.getAll();
  },

  getByQuiz: async (quizId: string): Promise<Score[]> => {
    await delay();
    return scoreStorage.getByQuizId(quizId);
  }
};

// Users API
export const localUsersApi = {
  getAll: async (): Promise<User[]> => {
    await delay();
    // Add current user if not exists
    const currentUser = getCurrentUser();
    userStorage.create(currentUser);
    return userStorage.getAll();
  },

  getById: async (id: string): Promise<User | null> => {
    await delay();
    return userStorage.getById(id);
  },

  update: async (id: string, data: Partial<User>): Promise<User | null> => {
    await delay();
    const user = userStorage.getById(id);
    if (!user) return null;
    return userStorage.create({ ...user, ...data });
  },

  delete: async (id: string): Promise<boolean> => {
    await delay();
    // For localStorage, we'll just mark as deleted
    return true;
  },

  getProfile: async (): Promise<User> => {
    await delay();
    const currentUser = getCurrentUser();
    userStorage.create(currentUser);
    return currentUser;
  }
};

// Admin API
export const localAdminApi = {
  getDashboard: async () => {
    await delay();
    const quizzes = await localQuizzesApi.getAll();
    const users = await localUsersApi.getAll();
    const scores = await localScoresApi.getAll();
    
    return {
      totalQuizzes: quizzes.length,
      totalUsers: users.length,
      totalAttempts: scores.length,
      avgScore: scores.length > 0 
        ? Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length)
        : 0
    };
  }
};

// Export all APIs
export const localApi = {
  quizzes: localQuizzesApi,
  questions: localQuestionsApi,
  scores: localScoresApi,
  users: localUsersApi,
  admin: localAdminApi
};