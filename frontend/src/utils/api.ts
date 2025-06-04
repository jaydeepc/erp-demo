import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: {
    username: string;
    password: string;
    fullName: string;
    email: string;
    role?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// User API
export const userAPI = {
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

// Expense API
export const expenseAPI = {
  // Employee endpoints
  submitExpense: async (expenseData: {
    amount: number;
    currency: string;
    description: string;
    expenseDate: string;
  }) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  getMyExpenses: async () => {
    const response = await api.get('/expenses/my');
    return response.data;
  },

  // Manager endpoints
  getPendingExpenses: async (userId?: string) => {
    const url = userId ? `/expenses/pending?userId=${userId}` : '/expenses/pending';
    const response = await api.get(url);
    return response.data;
  },

  approveExpense: async (expenseId: string, comments?: string) => {
    const response = await api.put(`/expenses/${expenseId}/approve`, { comments });
    return response.data;
  },

  rejectExpense: async (expenseId: string, comments?: string) => {
    const response = await api.put(`/expenses/${expenseId}/reject`, { comments });
    return response.data;
  },
};

export default api;
