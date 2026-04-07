import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

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

// Add a response interceptor to handle "No Backend" scenario for demo purposes
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If the backend is not reachable (Network Error), return mock data for the demo
    if (!error.response || error.code === 'ERR_NETWORK') {
      const { config } = error;
      
      console.warn('Backend not reachable. Using mock data for demo purposes.');

      if (config.url.includes('/auth/login')) {
        return { data: { token: 'mock.eyJuYW1lIjogIkRlbW8gVXNlciJ9.demo' } };
      }
      
      if (config.url.includes('/auth/register')) {
        return { data: { message: 'Success' } };
      }

      if (config.url.includes('/expenses') && config.method === 'get') {
        return { data: [...mockExpenses] };
      }

      if (config.url.includes('/expenses') && config.method === 'post') {
        const newExp = { ...JSON.parse(config.data), id: Math.random().toString() };
        mockExpenses.push(newExp);
        return { data: newExp };
      }

      if (config.url.includes('/expenses/') && config.method === 'delete') {
        const id = config.url.split('/expenses/')[1];
        mockExpenses = mockExpenses.filter(e => e.id !== id);
        return { data: {} };
      }

      // Budget mock endpoints
      if (config.url.includes('/budgets/spending') && config.method === 'get') {
        return { data: getMockSpending() };
      }

      if (config.url.includes('/budgets') && config.method === 'get') {
        return { data: [...mockBudgets] };
      }

      if (config.url.includes('/budgets/') && config.method === 'put') {
        const category = decodeURIComponent(config.url.split('/budgets/')[1]);
        const body = JSON.parse(config.data);
        const idx = mockBudgets.findIndex(b => b.category === category);
        if (idx >= 0) {
          mockBudgets[idx] = { ...mockBudgets[idx], limitAmount: body.limitAmount };
        } else {
          mockBudgets.push({ id: Math.random().toString(), category, limitAmount: body.limitAmount });
        }
        return { data: mockBudgets.find(b => b.category === category) };
      }

      if (config.url.includes('/budgets/') && config.method === 'delete') {
        const category = decodeURIComponent(config.url.split('/budgets/')[1]);
        mockBudgets = mockBudgets.filter(b => b.category !== category);
        return { data: {} };
      }
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
