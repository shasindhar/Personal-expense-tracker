import axios from 'axios';

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
