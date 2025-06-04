const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Auth API
export const authAPI = {
  register: async (userData: {
    username: string;
    password: string;
    fullName: string;
    email: string;
    role?: string;
  }) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { username: string; password: string }) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  verify: async () => {
    return await apiRequest('/auth/verify');
  },
};

// User API
export const userAPI = {
  getMe: async () => {
    return await apiRequest('/users/me');
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
    return await apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  },

  getMyExpenses: async () => {
    return await apiRequest('/expenses/my');
  },

  // Manager endpoints
  getPendingExpenses: async (userId?: string) => {
    const url = userId ? `/expenses/pending?userId=${userId}` : '/expenses/pending';
    return await apiRequest(url);
  },

  approveExpense: async (expenseId: string, comments?: string) => {
    return await apiRequest(`/expenses/${expenseId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ comments }),
    });
  },

  rejectExpense: async (expenseId: string, comments?: string) => {
    return await apiRequest(`/expenses/${expenseId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ comments }),
    });
  },
};

export default { authAPI, userAPI, expenseAPI };
