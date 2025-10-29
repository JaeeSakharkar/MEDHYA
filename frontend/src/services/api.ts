// const BASE_URL = 'http://localhost:5000'; // Change to your backend URL

// // Helper to add Authorization header
// function authHeaders(token?: string) {
//   return token ? { 'Authorization': `Bearer ${token}` } : {};
// }

// // Auth Types
// export interface AuthResponse {
//   accessToken: string;
//   refreshToken?: string;
// }
// export interface RegisterRequest { name: string; email: string; password: string; }
// export interface LoginRequest { email: string; password: string; }

// // Quiz App Types
// export interface Quiz { id: number; title: string; subject: string; }
// export interface Question { id: number; question: string; options?: string[]; }
// export interface Score { quizId: number; score: number; totalQuestions: number; attemptDate: string; }
// export interface UserProfile { name: string; email: string; }

// // ========== AUTH ROUTES ==========
// export const login = async (data: LoginRequest) => {
//   const response = await fetch(`${BASE_URL}/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) throw new Error('Login failed');
//   return response.json() as Promise<AuthResponse>;
// };

// export const register = async (data: RegisterRequest) => {
//   const response = await fetch(`${BASE_URL}/auth/register`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) throw new Error('Registration failed');
//   return response.json() as Promise<AuthResponse>;
// };

// export const refreshToken = async (refreshToken: string) => {
//   const response = await fetch(`${BASE_URL}/auth/refresh`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ refreshToken }),
//   });
//   if (!response.ok) throw new Error('Refresh failed');
//   return response.json() as Promise<AuthResponse>;
// };

// export const getUserProfile = async (token: string) => {
//   const response = await fetch(`${BASE_URL}/profile`, { headers: authHeaders(token) });
//   if (!response.ok) throw new Error('Profile fetch failed');
//   return response.json() as Promise<UserProfile>;
// };

// // ========== QUIZ ROUTES ==========
// export const fetchQuizzes = async (token: string) => {
//   const response = await fetch(`${BASE_URL}/quizzes`, { headers: authHeaders(token) });
//   if (!response.ok) throw new Error('Failed to fetch quizzes');
//   return response.json() as Promise<Quiz[]>;
// };

// export const fetchQuizById = async (id: number, token: string) => {
//   const response = await fetch(`${BASE_URL}/quizzes/${id}`, { headers: authHeaders(token) });
//   if (!response.ok) throw new Error('Failed to fetch quiz');
//   return response.json() as Promise<Quiz>;
// };

// // ========== QUESTION ROUTES ==========
// export const fetchQuestions = async (quizId: number, token: string) => {
//   const response = await fetch(`${BASE_URL}/questions/${quizId}`, { headers: authHeaders(token) });
//   if (!response.ok) throw new Error('Failed to fetch questions');
//   return response.json() as Promise<Question[]>;
// };

// // ========== SCORE ROUTES ==========
// export const fetchScores = async (token: string) => {
//   const response = await fetch(`${BASE_URL}/scores`, { headers: authHeaders(token) });
//   if (!response.ok) throw new Error('Failed to fetch scores');
//   return response.json() as Promise<Score[]>;
// };

// export const fetchScoresForQuiz = async (quizId: number, token: string) => {
//   const response = await fetch(`${BASE_URL}/scores/${quizId}`, { headers: authHeaders(token) });
//   if (!response.ok) throw new Error('Failed to fetch quiz scores');
//   return response.json() as Promise<Score[]>;
// };

// export const submitScore = async (score: Omit<Score, 'attemptDate'>, token: string) => {
//   const response = await fetch(`${BASE_URL}/scores`, {
//     method: 'POST',
//     headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
//     body: JSON.stringify(score),
//   });
//   if (!response.ok) throw new Error('Failed to submit score');
// };

// // ========== ADMIN ROUTES ==========
// export const createQuiz = async (data: Partial<Quiz>, token: string) => {
//   const response = await fetch(`${BASE_URL}/quizzes`, {
//     method: 'POST',
//     headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) throw new Error('Failed to create quiz');
//   return response.json() as Promise<Quiz>;
// };

// export const updateQuiz = async (id: number, data: Partial<Quiz>, token: string) => {
//   const response = await fetch(`${BASE_URL}/quizzes/${id}`, {
//     method: 'PUT',
//     headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) throw new Error('Failed to update quiz');
//   return response.json() as Promise<Quiz>;
// };

// export const deleteQuiz = async (id: number, token: string) => {
//   const response = await fetch(`${BASE_URL}/quizzes/${id}`, {
//     method: 'DELETE',
//     headers: authHeaders(token),
//   });
//   if (!response.ok) throw new Error('Failed to delete quiz');
// };

// export const createQuestion = async (quizId: number, data: Partial<Question>, token: string) => {
//   const response = await fetch(`${BASE_URL}/questions/${quizId}`, {
//     method: 'POST',
//     headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) throw new Error('Failed to add question');
//   return response.json() as Promise<Question>;
// };

// export const updateQuestion = async (questionId: number, data: Partial<Question>, token: string) => {
//   const response = await fetch(`${BASE_URL}/questions/${questionId}`, {
//     method: 'PUT',
//     headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) throw new Error('Failed to update question');
//   return response.json() as Promise<Question>;
// };

// export const deleteQuestion = async (questionId: number, token: string) => {
//   const response = await fetch(`${BASE_URL}/questions/${questionId}`, {
//     method: 'DELETE',
//     headers: authHeaders(token),
//   });
//   if (!response.ok) throw new Error('Failed to delete question');
// };

// export const fetchAllScores = async (token: string) => {
//   const response = await fetch(`${BASE_URL}/scores/all`, { headers: authHeaders(token) });
//   if (!response.ok) throw new Error('Failed to fetch all scores');
//   return response.json() as Promise<Score[]>;
// };

// export const fetchUsers = async (token: string) => {
//   const response = await fetch(`${BASE_URL}/users`, { headers: authHeaders(token) });
//   if (!response.ok) throw new Error('Failed to fetch users');
//   return response.json();
// };

// export const fetchUserById = async (id: string, token: string) => {
//   const response = await fetch(`${BASE_URL}/users/${id}`, { headers: authHeaders(token) });
//   if (!response.ok) throw new Error('Failed to fetch user');
//   return response.json();
// };
// ========== MOCK DATA ==========

export interface Quiz { id: number; title: string; subject: string; }
export interface Question { id: number; question: string; options?: string[]; }
export interface Score { quizId: number; score: number; totalQuestions: number; attemptDate: string; }
export interface UserProfile { name: string; email: string; }

const mockQuizzes: Quiz[] = [
  { id: 1, title: "JavaScript Fundamentals", subject: "Programming" },
  { id: 2, title: "React Basics", subject: "Frontend" },
  { id: 3, title: "Data Structures", subject: "Computer Science" },
  { id: 4, title: "CSS Advanced Techniques", subject: "Frontend" },
  { id: 5, title: "Node.js & APIs", subject: "Backend" },
  { id: 6, title: "Database Design", subject: "Backend" },
];

const mockQuestions: Record<number, Question[]> = {
  1: [
    { id: 1, question: "What is a closure in JavaScript?", options: ["A function within another function", "A loop", "A variable", "An object"] },
    { id: 2, question: "What does 'const' mean?", options: ["Constant variable", "Constructor", "Console", "Context"] },
    { id: 3, question: "What is the purpose of 'async/await'?", options: ["Handle asynchronous operations", "Create loops", "Define classes", "Import modules"] },
  ],
  2: [
    { id: 1, question: "What is JSX?", options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Express"] },
    { id: 2, question: "What is a React Hook?", options: ["Function that lets you use state", "A CSS framework", "A database", "A router"] },
  ],
  3: [
    { id: 1, question: "What is a Stack data structure?", options: ["LIFO structure", "FIFO structure", "Random access", "Tree structure"] },
    { id: 2, question: "What is Big O notation?", options: ["Time complexity measure", "A programming language", "A design pattern", "A testing framework"] },
  ],
};

let mockScores: Score[] = [
  { quizId: 1, score: 2, totalQuestions: 3, attemptDate: new Date(Date.now() - 86400000).toISOString() },
  { quizId: 2, score: 2, totalQuestions: 2, attemptDate: new Date(Date.now() - 172800000).toISOString() },
];

const mockProfile: UserProfile = { name: "John Doe", email: "john@example.com" };

// ========== MOCK API FUNCTIONS ==========

// AUTH
export const login = async () => {
  await new Promise(res => setTimeout(res, 300));
  return { accessToken: "mocktoken" };
};
export const register = login;
export const refreshToken = login;
export const getUserProfile = async () => {
  await new Promise(res => setTimeout(res, 200));
  return mockProfile;
};

// QUIZZES
export const fetchQuizzes = async () => {
  await new Promise(res => setTimeout(res, 300));
  return mockQuizzes;
};
export const fetchQuizById = async (id: number) => {
  await new Promise(res => setTimeout(res, 150));
  return mockQuizzes.find(q => q.id === id);
};

// QUESTIONS
export const fetchQuestions = async (quizId: number) => {
  await new Promise(res => setTimeout(res, 200));
  return mockQuestions[quizId] || [];
};

// SCORES
export const fetchScores = async () => {
  await new Promise(res => setTimeout(res, 200));
  return [...mockScores];
};
export const fetchScoresForQuiz = async (quizId: number) => {
  await new Promise(res => setTimeout(res, 200));
  return mockScores.filter(s => s.quizId === quizId);
};
export const submitScore = async (score: Omit<Score, 'attemptDate'>) => {
  await new Promise(res => setTimeout(res, 150));
  mockScores.push({ ...score, attemptDate: new Date().toISOString() });
};

// ADMIN (mock only, non-functional)
export const createQuiz = async () => {}; // No-op
export const updateQuiz = async () => {};
export const deleteQuiz = async () => {};
export const createQuestion = async () => {};
export const updateQuestion = async () => {};
export const deleteQuestion = async () => {};
export const fetchAllScores = async () => { return [...mockScores]; };
export const fetchUsers = async () => { return [{ id: 1, name: "John Doe", email: "john@example.com" }]; };
export const fetchUserById = async () => { return mockProfile; };
