const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper to add Authorization header
function authHeaders(token?: string) {
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Quiz App Types
export interface Quiz { id: number; title: string; subject: string; }
export interface Question { id: number; question: string; options?: string[]; }
export interface Score { quizId: number; score: number; totalQuestions: number; attemptDate: string; }
export interface UserProfile { name: string; email: string; }

// ===== USER PROFILE =====
export const getUserProfile = async (token: string) => {
  const response = await fetch(`${BASE_URL}/profile`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error('Profile fetch failed');
  return response.json() as Promise<UserProfile>;
};

// ===== QUIZZES =====
export const fetchQuizzes = async (token: string) => {
  const response = await fetch(`${BASE_URL}/quizzes`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error('Failed to fetch quizzes');
  return response.json() as Promise<Quiz[]>;
};

export const fetchQuizById = async (id: number, token: string) => {
  const response = await fetch(`${BASE_URL}/quizzes/${id}`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error('Failed to fetch quiz');
  return response.json() as Promise<Quiz>;
};

// ===== QUESTIONS =====
export const fetchQuestions = async (quizId: number, token: string) => {
  const response = await fetch(`${BASE_URL}/questions/${quizId}`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error('Failed to fetch questions');
  return response.json() as Promise<Question[]>;
};

// ===== SCORES =====
export const fetchScores = async (token: string) => {
  const response = await fetch(`${BASE_URL}/scores`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error('Failed to fetch scores');
  return response.json() as Promise<Score[]>;
};

export const fetchScoresForQuiz = async (quizId: number, token: string) => {
  const response = await fetch(`${BASE_URL}/scores/${quizId}`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error('Failed to fetch quiz scores');
  return response.json() as Promise<Score[]>;
};

export const submitScore = async (score: Omit<Score, 'attemptDate'>, token: string) => {
  const response = await fetch(`${BASE_URL}/scores`, {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(score),
  });
  if (!response.ok) throw new Error('Failed to submit score');
};

// ===== ADMIN ROUTES =====
export const createQuiz = async (data: Partial<Quiz>, token: string) => {
  const response = await fetch(`${BASE_URL}/quizzes`, {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create quiz');
  return response.json() as Promise<Quiz>;
};

export const updateQuiz = async (id: number, data: Partial<Quiz>, token: string) => {
  const response = await fetch(`${BASE_URL}/quizzes/${id}`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update quiz');
  return response.json() as Promise<Quiz>;
};

export const deleteQuiz = async (id: number, token: string) => {
  const response = await fetch(`${BASE_URL}/quizzes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to delete quiz');
};

export const createQuestion = async (quizId: number, data: Partial<Question>, token: string) => {
  const response = await fetch(`${BASE_URL}/questions/${quizId}`, {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add question');
  return response.json() as Promise<Question>;
};

export const updateQuestion = async (questionId: number, data: Partial<Question>, token: string) => {
  const response = await fetch(`${BASE_URL}/questions/${questionId}`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update question');
  return response.json() as Promise<Question>;
};

export const deleteQuestion = async (questionId: number, token: string) => {
  const response = await fetch(`${BASE_URL}/questions/${questionId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to delete question');
};

export const fetchAllScores = async (token: string) => {
  const response = await fetch(`${BASE_URL}/scores/all`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error('Failed to fetch all scores');
  return response.json() as Promise<Score[]>;
};

export const fetchUsers = async (token: string) => {
  const response = await fetch(`${BASE_URL}/users`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

export const fetchUserById = async (id: string, token: string) => {
  const response = await fetch(`${BASE_URL}/users/${id}`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

