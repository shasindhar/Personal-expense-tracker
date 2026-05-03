import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for demonstration when backend is not connected
const MOCK_EXPENSES = [
  { id: '1', title: 'Monthly Salary', amount: 5000, category: 'Salary', type: 'income', date: '2024-03-01' },
  { id: '2', title: 'Freelance Project', amount: 1200, category: 'Salary', type: 'income', date: '2024-03-15' },
  { id: '3', title: 'Monthly Rent', amount: 1200, category: 'Bills & Utilities', type: 'expense', date: '2024-03-01', notes: 'Main apartment' },
  { id: '4', title: 'Grocery Run', amount: 85.50, category: 'Food & Dining', type: 'expense', date: '2024-03-05', notes: 'Weekly groceries' },
  { id: '5', title: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', type: 'expense', date: '2024-03-07' },
  { id: '6', title: 'Gas Station', amount: 45.00, category: 'Transportation', type: 'expense', date: '2024-03-10' },
  { id: '7', title: 'Dinner with Friends', amount: 120.00, category: 'Food & Dining', type: 'expense', date: '2024-03-12' },
  { id: '8', title: 'Gym Membership', amount: 50.00, category: 'Health', type: 'expense', date: '2024-03-02' },
];

// No predefined budgets — each user sets their own unique limits
const MOCK_BUDGETS = [];

// In-memory mock store for demo mutations
let mockBudgets = [...MOCK_BUDGETS];
let mockExpenses = [...MOCK_EXPENSES];

// Local helper to get current month spending for mocks
const getMockSpending = () => {
  const now = new Date();
  const currMonth = now.getMonth();
  const currYear = now.getFullYear();

  return mockExpenses.reduce((acc, exp) => {
    const d = new Date(exp.date);
    if (exp.type === 'expense' && d.getMonth() === currMonth && d.getFullYear() === currYear) {
      acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
    }
    return acc;
  }, {});
};

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle session expiration (401/403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend says the token is invalid or expired, force logout
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Budget helper functions ──────────────────────────────────────────────────

export const getBudgets = () => api.get('/budgets').then(r => r.data);

export const upsertBudget = (category, limitAmount) =>
  api.put(`/budgets/${encodeURIComponent(category)}`, { category, limitAmount }).then(r => r.data);

export const deleteBudget = (category) =>
  api.delete(`/budgets/${encodeURIComponent(category)}`).then(r => r.data);

export const getCategorySpending = () =>
  api.get('/budgets/spending').then(r => r.data);

export default api;
