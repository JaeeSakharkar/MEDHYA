// API client for MEDHYA Medical Education Platform
// Base URL should be set in environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Chapters API
export const chaptersApi = {
  getBySubject: (subjectId: string, token: string) =>
    apiCall(`/chapters/${subjectId}`, {}, token),
  create: (subjectId: string, data: any, token: string) =>
    apiCall(`/chapters/${subjectId}`, { method: 'POST', body: JSON.stringify(data) }, token),
  update: (subjectId: string, chapterId: string, data: any, token: string) =>
    apiCall(`/chapters/${subjectId}/${chapterId}`, { method: 'PUT', body: JSON.stringify(data) }, token),
  delete: (subjectId: string, chapterId: string, token: string) =>
    apiCall(`/chapters/${subjectId}/${chapterId}`, { method: 'DELETE' }, token),
};

// Questions API
export const questionsApi = {
  getByQuiz: (quizId: string, token: string) =>
    apiCall(`/questions/${quizId}`, {}, token),
  create: (quizId: string, data: any, token: string) =>
    apiCall(`/questions/${quizId}`, { method: 'POST', body: JSON.stringify(data) }, token),
  update: (quizId: string, questionId: string, data: any, token: string) =>
    apiCall(`/questions/${quizId}/${questionId}`, { method: 'PUT', body: JSON.stringify(data) }, token),
  delete: (quizId: string, questionId: string, token: string) =>
    apiCall(`/questions/${quizId}/${questionId}`, { method: 'DELETE' }, token),
};

// Quizzes API
export const quizzesApi = {
  getAll: (token: string) =>
    apiCall('/quizzes', {}, token),
  getById: (id: string, token: string) =>
    apiCall(`/quizzes/${id}`, {}, token),
  create: (data: any, token: string) =>
    apiCall('/quizzes', { method: 'POST', body: JSON.stringify(data) }, token),
  update: (id: string, data: any, token: string) =>
    apiCall(`/quizzes/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
  delete: (id: string, token: string) =>
    apiCall(`/quizzes/${id}`, { method: 'DELETE' }, token),
};

// Scores API
export const scoresApi = {
  getMy: (token: string) =>
    apiCall('/scores', {}, token),
  submit: (data: any, token: string) =>
    apiCall('/scores', { method: 'POST', body: JSON.stringify(data) }, token),
  getAll: (token: string) =>
    apiCall('/scores/all', {}, token),
  getByQuiz: (quizId: string, token: string) =>
    apiCall(`/scores/${quizId}`, {}, token),
};

// Users API
export const usersApi = {
  getAll: (token: string) =>
    apiCall('/users', {}, token),
  getById: (id: string, token: string) =>
    apiCall(`/users/${id}`, {}, token),
  update: (id: string, data: any, token: string) =>
    apiCall(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
  delete: (id: string, token: string) =>
    apiCall(`/users/${id}`, { method: 'DELETE' }, token),
  getProfile: (token: string) =>
    apiCall('/profile', {}, token),
};

// Admin API
export const adminApi = {
  getDashboard: (token: string) =>
    apiCall('/admin', {}, token),
};
