// S3-based API service for QuizMaster V2
import { s3QuizStorage, s3QuestionStorage, s3ScoreStorage, s3UserStorage, Quiz, Question, Score, User } from './s3Storage';

// Simulate API delay for realistic experience
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

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
export const s3QuizzesApi = {
  getAll: async (): Promise<Quiz[]> => {
    await delay();
    return await s3QuizStorage.getAll();
  },

  getById: async (id: string): Promise<Quiz | null> => {
    await delay();
    return await s3QuizStorage.getById(id);
  },

  create: async (data: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> => {
    await delay();
    return await s3QuizStorage.create(data);
  },

  update: async (id: string, data: Partial<Quiz>): Promise<Quiz | null> => {
    await delay();
    return await s3QuizStorage.update(id, data);
  },

  delete: async (id: string): Promise<boolean> => {
    await delay();
    return await s3QuizStorage.delete(id);
  }
};

// Questions API
export const s3QuestionsApi = {
  getByQuiz: async (quizId: string): Promise<Question[]> => {
    await delay();
    return await s3QuestionStorage.getByQuizId(quizId);
  },

  create: async (quizId: string, data: Omit<Question, 'id' | 'quizId'>): Promise<Question> => {
    await delay();
    return await s3QuestionStorage.create({ ...data, quizId });
  },

  update: async (quizId: string, questionId: string, data: Partial<Question>): Promise<Question | null> => {
    await delay();
    return await s3QuestionStorage.update(questionId, data);
  },

  delete: async (quizId: string, questionId: string): Promise<boolean> => {
    await delay();
    return await s3QuestionStorage.delete(questionId);
  }
};

// Scores API
export const s3ScoresApi = {
  getMy: async (): Promise<Score[]> => {
    await delay();
    const currentUser = getCurrentUser();
    return await s3ScoreStorage.getByUserId(currentUser.id);
  },

  submit: async (data: { quizId: string; score: number; totalQuestions: number }): Promise<Score> => {
    await delay();
    const currentUser = getCurrentUser();
    return await s3ScoreStorage.create({
      userId: currentUser.id,
      quizId: data.quizId,
      score: data.score,
      totalQuestions: data.totalQuestions
    });
  },

  getAll: async (): Promise<Score[]> => {
    await delay();
    return await s3ScoreStorage.getAll();
  },

  getByQuiz: async (quizId: string): Promise<Score[]> => {
    await delay();
    return await s3ScoreStorage.getByQuizId(quizId);
  }
};

// Users API
export const s3UsersApi = {
  getAll: async (): Promise<User[]> => {
    await delay();
    // Add current user if not exists
    const currentUser = getCurrentUser();
    await s3UserStorage.create(currentUser);
    return await s3UserStorage.getAll();
  },

  getById: async (id: string): Promise<User | null> => {
    await delay();
    return await s3UserStorage.getById(id);
  },

  update: async (id: string, data: Partial<User>): Promise<User | null> => {
    await delay();
    const user = await s3UserStorage.getById(id);
    if (!user) return null;
    return await s3UserStorage.create({ ...user, ...data });
  },

  delete: async (id: string): Promise<boolean> => {
    await delay();
    // For S3 storage, we'll just mark as deleted
    return true;
  },

  getProfile: async (): Promise<User> => {
    await delay();
    const currentUser = getCurrentUser();
    await s3UserStorage.create(currentUser);
    return currentUser;
  }
};

// Admin API
export const s3AdminApi = {
  getDashboard: async () => {
    await delay();
    const quizzes = await s3QuizzesApi.getAll();
    const users = await s3UsersApi.getAll();
    const scores = await s3ScoresApi.getAll();
    
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
export const s3Api = {
  quizzes: s3QuizzesApi,
  questions: s3QuestionsApi,
  scores: s3ScoresApi,
  users: s3UsersApi,
  admin: s3AdminApi
};