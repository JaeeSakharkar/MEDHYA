// Backend API service for MongoDB integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
};

// Quiz API
export const backendQuizzesApi = {
  getAll: async () => {
    return apiCall('/quizzes');
  },

  getById: async (id: string) => {
    return apiCall(`/quizzes/${id}`);
  },

  create: async (data: any) => {
    // Transform data to match backend expectations
    const quizData = {
      id: `quiz-${Date.now()}`,
      title: data.title,
      description: data.description,
      chapterId: data.subjectId || data.subject || 'general'
    };
    return apiCall('/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  },

  update: async (id: string, data: any) => {
    return apiCall(`/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/quizzes/${id}`, {
      method: 'DELETE',
    });
  }
};

// Questions API
export const backendQuestionsApi = {
  getByQuiz: async (quizId: string) => {
    return apiCall(`/questions/${quizId}`);
  },

  create: async (quizId: string, data: any) => {
    // Transform data to match backend expectations
    const questionData = {
      id: `q${Date.now()}`,
      text: data.question, // Frontend sends 'question', backend expects 'text'
      options: data.options,
      correctAnswer: data.correctAnswer
    };
    return apiCall(`/questions/${quizId}`, {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  },

  update: async (quizId: string, questionId: string, data: any) => {
    return apiCall(`/questions/${quizId}/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (quizId: string, questionId: string) => {
    return apiCall(`/questions/${quizId}/${questionId}`, {
      method: 'DELETE',
    });
  }
};

// Scores API
export const backendScoresApi = {
  getMy: async () => {
    return apiCall('/scores');
  },

  submit: async (data: { quizId: string; score: number; totalQuestions: number }) => {
    return apiCall('/scores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return apiCall('/scores/all');
  },

  getByQuiz: async (quizId: string) => {
    return apiCall(`/scores/${quizId}`);
  }
};

// Users API (placeholder - you might not have user management yet)
export const backendUsersApi = {
  getAll: async () => {
    // Return mock data for now since we don't have user management
    return [
      { id: 'dev-user-123', email: 'dev@example.com', name: 'Development User' }
    ];
  },

  getProfile: async () => {
    return { id: 'dev-user-123', email: 'dev@example.com', name: 'Development User' };
  }
};

// Chapters API
export const backendChaptersApi = {
  getBySubject: async (subjectId: string) => {
    return apiCall(`/chapters/${subjectId}`);
  },

  create: async (subjectId: string, data: any) => {
    const chapterData = {
      id: `chapter-${Date.now()}`,
      name: data.title,
      description: data.description,
      order: data.order || 0
    };
    return apiCall(`/chapters/${subjectId}`, {
      method: 'POST',
      body: JSON.stringify(chapterData),
    });
  },

  update: async (subjectId: string, chapterId: string, data: any) => {
    const chapterData = {
      name: data.title,
      description: data.description,
      order: data.order || 0
    };
    return apiCall(`/chapters/${subjectId}/${chapterId}`, {
      method: 'PUT',
      body: JSON.stringify(chapterData),
    });
  },

  delete: async (subjectId: string, chapterId: string) => {
    return apiCall(`/chapters/${subjectId}/${chapterId}`, {
      method: 'DELETE',
    });
  }
};

// Export combined API
export const backendApi = {
  quizzes: backendQuizzesApi,
  questions: backendQuestionsApi,
  scores: backendScoresApi,
  users: backendUsersApi,
  chapters: backendChaptersApi
};

// Debug function to test API connectivity
export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    const response = await fetch(`${API_BASE_URL}/`);
    const text = await response.text();
    console.log('Backend response:', text);
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
};