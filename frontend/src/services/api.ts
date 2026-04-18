import axios from 'axios';

// Use VITE_API_URL if provided, otherwise use relative path (same origin)
const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { email: string; password: string; first_name: string; last_name: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  me: () => api.get('/api/users/me'),
};

export const productsAPI = {
  getAll: (params?: { category?: string; min_price?: number; max_price?: number }) =>
    api.get('/api/products', { params }),
  getById: (id: string) => api.get(`/api/products/${id}`),
  getCategories: () => api.get('/api/categories'),
};

export const cartAPI = {
  get: () => api.get('/api/cart'),
  addItem: (product_id: string, quantity: number) =>
    api.post('/api/cart/items', { product_id, quantity }),
  updateItem: (itemId: string, quantity: number) =>
    api.put(`/api/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => api.delete(`/api/cart/items/${itemId}`),
};

export default api;