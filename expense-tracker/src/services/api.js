import axios from 'axios';

<<<<<<< HEAD
// Use environment variable for API URL in production, fallback to localhost for development
=======
>>>>>>> firstWorking
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
<<<<<<< HEAD
  (error) => {
    let message = 'An unexpected error occurred.';
    
    if (error.code === 'ERR_NETWORK') {
      message = 'Backend not reachable. Please check if the server is running.';
      console.error(message);
    } else if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    }
    
    // If 401 Unauthorized, clear token and redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on login or register page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
=======
  async (error) => {
    // If the backend is not reachable (Network Error), return mock data for the demo
    if (!error.response || error.code === 'ERR_NETWORK') {
      const { config } = error;
      
      console.warn('Backend not reachable. Using mock data for demo purposes.');

      if (config.url.includes('/auth/login')) {
        return { data: { token: 'mock.eyJuYW1lIjogIkRlbW8gVXNlciJ9.demo' } };
      }

      if (config.url.includes('/auth/google')) {
        return { data: { token: 'mock.eyJuYW1lIjogIkdvb2dsZSBVc2VyIn0.demo', user: { name: 'Google User', email: 'google@example.com' } } };
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
>>>>>>> firstWorking
      }
    }
    
    // Attach the friendly message to the error object so components can use it
    error.friendlyMessage = message;
    
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
