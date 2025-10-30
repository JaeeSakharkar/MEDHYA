// Backend API service for MongoDB integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper function for API calls with fallback
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    // Fallback for production when backend is not available
    if (import.meta.env.PROD && (API_BASE_URL.includes('your-actual-backend-url-here') || API_BASE_URL.includes('execute-api'))) {
      console.warn('Backend not available, using mock data for:', endpoint);
      return getMockData(endpoint, options.method || 'GET');
    }
    throw error;
  }
};

// Mock data fallback for production
const getMockData = (endpoint: string, method: string) => {
  // Mock Quizzes
  if (endpoint === '/quizzes' && method === 'GET') {
    return [
      {
        id: 1,
        title: 'Medical Terminology Basics',
        subject: 'medical-terminology',
        description: 'Learn essential medical terms and their meanings',
        chapterId: 'medical-terminology',
        createdAt: '2025-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        title: 'Human Anatomy Fundamentals',
        subject: 'anatomy',
        description: 'Basic understanding of human body systems',
        chapterId: 'anatomy',
        createdAt: '2025-01-01T00:00:00.000Z'
      },
      {
        id: 3,
        title: 'Pharmacology Introduction',
        subject: 'pharmacology',
        description: 'Introduction to drug classifications and mechanisms',
        chapterId: 'pharmacology',
        createdAt: '2025-01-01T00:00:00.000Z'
      },
      {
        id: 4,
        title: 'Clinical Procedures',
        subject: 'clinical',
        description: 'Common clinical procedures and protocols',
        chapterId: 'clinical',
        createdAt: '2025-01-01T00:00:00.000Z'
      }
    ];
  }

  // Mock Questions for specific quizzes
  if (endpoint.startsWith('/questions/') && method === 'GET') {
    const quizId = endpoint.split('/')[2];
    
    if (quizId === '1') {
      return [
        {
          id: 1,
          question: 'What does the prefix "cardio-" refer to?',
          options: ['Heart', 'Lung', 'Brain', 'Kidney'],
          correctAnswer: 'Heart',
          quizId: '1',
          createdAt: '2025-01-01T00:00:00.000Z'
        },
        {
          id: 2,
          question: 'What does the suffix "-itis" mean?',
          options: ['Removal', 'Inflammation', 'Study of', 'Condition'],
          correctAnswer: 'Inflammation',
          quizId: '1',
          createdAt: '2025-01-01T00:00:00.000Z'
        },
        {
          id: 3,
          question: 'What does "hyper-" mean?',
          options: ['Below normal', 'Above normal', 'Normal', 'Without'],
          correctAnswer: 'Above normal',
          quizId: '1',
          createdAt: '2025-01-01T00:00:00.000Z'
        }
      ];
    }
    
    if (quizId === '2') {
      return [
        {
          id: 4,
          question: 'How many chambers does the human heart have?',
          options: ['2', '3', '4', '5'],
          correctAnswer: '4',
          quizId: '2',
          createdAt: '2025-01-01T00:00:00.000Z'
        },
        {
          id: 5,
          question: 'Which organ is responsible for filtering blood?',
          options: ['Liver', 'Kidney', 'Spleen', 'Pancreas'],
          correctAnswer: 'Kidney',
          quizId: '2',
          createdAt: '2025-01-01T00:00:00.000Z'
        },
        {
          id: 6,
          question: 'What is the largest bone in the human body?',
          options: ['Tibia', 'Femur', 'Humerus', 'Radius'],
          correctAnswer: 'Femur',
          quizId: '2',
          createdAt: '2025-01-01T00:00:00.000Z'
        }
      ];
    }
    
    if (quizId === '3') {
      return [
        {
          id: 7,
          question: 'What does "mg" stand for in medication dosing?',
          options: ['Milligram', 'Microgram', 'Megagram', 'Milligrade'],
          correctAnswer: 'Milligram',
          quizId: '3',
          createdAt: '2025-01-01T00:00:00.000Z'
        },
        {
          id: 8,
          question: 'Which route of administration provides the fastest drug absorption?',
          options: ['Oral', 'Intramuscular', 'Intravenous', 'Topical'],
          correctAnswer: 'Intravenous',
          quizId: '3',
          createdAt: '2025-01-01T00:00:00.000Z'
        }
      ];
    }
    
    return []; // Empty for other quiz IDs
  }

  // Mock Scores
  if (endpoint === '/scores/all' && method === 'GET') {
    return [
      {
        id: '1',
        userId: 'student-001',
        quizId: '1',
        score: 8,
        totalQuestions: 10,
        attemptDate: '2025-01-15T10:30:00.000Z',
        createdAt: '2025-01-15T10:30:00.000Z'
      },
      {
        id: '2',
        userId: 'student-002',
        quizId: '1',
        score: 9,
        totalQuestions: 10,
        attemptDate: '2025-01-15T11:15:00.000Z',
        createdAt: '2025-01-15T11:15:00.000Z'
      },
      {
        id: '3',
        userId: 'student-001',
        quizId: '2',
        score: 7,
        totalQuestions: 10,
        attemptDate: '2025-01-16T09:45:00.000Z',
        createdAt: '2025-01-16T09:45:00.000Z'
      },
      {
        id: '4',
        userId: 'student-003',
        quizId: '3',
        score: 6,
        totalQuestions: 8,
        attemptDate: '2025-01-17T14:20:00.000Z',
        createdAt: '2025-01-17T14:20:00.000Z'
      }
    ];
  }

  // Mock User Scores (for individual user)
  if (endpoint === '/scores' && method === 'GET') {
    return [
      {
        id: '1',
        userId: 'current-user',
        quizId: '1',
        score: 8,
        totalQuestions: 10,
        attemptDate: '2025-01-15T10:30:00.000Z',
        createdAt: '2025-01-15T10:30:00.000Z'
      },
      {
        id: '2',
        userId: 'current-user',
        quizId: '2',
        score: 7,
        totalQuestions: 10,
        attemptDate: '2025-01-16T09:45:00.000Z',
        createdAt: '2025-01-16T09:45:00.000Z'
      }
    ];
  }

  // Mock Chapters
  if (endpoint.startsWith('/chapters/') && method === 'GET') {
    const subjectId = endpoint.split('/')[2];
    
    if (subjectId === 'medical-terminology') {
      return [
        {
          id: 'chapter-1',
          title: 'Medical Prefixes',
          description: 'Common prefixes used in medical terminology',
          order: 1,
          subjectId: 'medical-terminology',
          createdAt: '2025-01-01T00:00:00.000Z'
        },
        {
          id: 'chapter-2',
          title: 'Medical Suffixes',
          description: 'Common suffixes used in medical terminology',
          order: 2,
          subjectId: 'medical-terminology',
          createdAt: '2025-01-01T00:00:00.000Z'
        }
      ];
    }
    
    if (subjectId === 'anatomy') {
      return [
        {
          id: 'chapter-3',
          title: 'Cardiovascular System',
          description: 'Heart and blood vessels anatomy',
          order: 1,
          subjectId: 'anatomy',
          createdAt: '2025-01-01T00:00:00.000Z'
        },
        {
          id: 'chapter-4',
          title: 'Respiratory System',
          description: 'Lungs and breathing mechanisms',
          order: 2,
          subjectId: 'anatomy',
          createdAt: '2025-01-01T00:00:00.000Z'
        }
      ];
    }
    
    return []; // Empty for other subjects
  }

  // Mock successful operations
  if (method === 'POST') {
    return {
      id: Date.now(),
      message: 'Created successfully (mock data)',
      success: true
    };
  }

  if (method === 'PUT') {
    return {
      id: Date.now(),
      message: 'Updated successfully (mock data)',
      success: true
    };
  }

  if (method === 'DELETE') {
    return {
      success: true,
      message: 'Deleted successfully (mock data)'
    };
  }

  // Default fallback
  return {
    message: 'MEDHYA Backend deployment in progress. Mock data is being displayed.',
    status: 'Backend deployment pending',
    note: 'This is temporary mock data. Real data will be available once backend is deployed.',
    data: []
  };
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

// Users API
export const backendUsersApi = {
  getAll: async () => {
    try {
      return await apiCall('/users');
    } catch (error) {
      // Fallback mock data for users
      return [
        { id: 'student-001', email: 'student1@medhya.com', name: 'Medical Student 1' },
        { id: 'student-002', email: 'student2@medhya.com', name: 'Medical Student 2' },
        { id: 'student-003', email: 'student3@medhya.com', name: 'Medical Student 3' }
      ];
    }
  },

  getProfile: async () => {
    try {
      return await apiCall('/profile');
    } catch (error) {
      return { id: 'current-user', email: 'user@medhya.com', name: 'MEDHYA User' };
    }
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