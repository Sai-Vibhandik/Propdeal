import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  register: (data) => api.post('/auth/register', data),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
};

// Properties API
export const propertiesAPI = {
  // Public
  getAll: (params) => api.get('/properties', { params }),
  getFeatured: () => api.get('/properties/featured'),
  getBySlug: (slug) => api.get(`/properties/${slug}`),

  // Admin
  getAdminAll: (params) => api.get('/properties/admin/all', { params }),
  getAdminOne: (id) => api.get(`/properties/admin/${id}`),
  create: (data) => api.post('/properties/admin', data),
  update: (id, data) => api.put(`/properties/admin/${id}`, data),
  delete: (id) => api.delete(`/properties/admin/${id}`),
  updateStatus: (id, status) => api.put(`/properties/admin/${id}/status`, { status }),
  toggleFeatured: (id) => api.put(`/properties/admin/${id}/featured`),
};

// Media API
export const mediaAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/admin/media/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append('video', file);
    return api.post('/admin/media/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append('document', file);
    return api.post('/admin/media/upload/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getPropertyMedia: (propertyId) => api.get(`/admin/media/property/${propertyId}`),
  reorder: (items) => api.put('/admin/media/reorder', { items }),
  update: (id, data) => api.put(`/admin/media/${id}`, data),
  delete: (id) => api.delete(`/admin/media/${id}`),
};

// Leads API
export const leadsAPI = {
  submit: (data) => api.post('/leads', data),
  getAdminAll: (params) => api.get('/leads/admin', { params }),
  getAdminOne: (id) => api.get(`/leads/admin/${id}`),
  updateStatus: (id, status) => api.put(`/leads/admin/${id}/status`, { status }),
  addNote: (id, note) => api.post(`/leads/admin/${id}/notes`, { note }),
  assign: (id, userId) => api.put(`/leads/admin/${id}/assign`, { userId }),
  setFollowUp: (id, date) => api.put(`/leads/admin/${id}/followup`, { date }),
  export: (params) => api.get('/leads/admin/export', { params, responseType: 'blob' }),
};

// Analytics API
export const analyticsAPI = {
  trackPageView: (data) => api.post('/analytics/pageview', data),
  trackCTA: (data) => api.post('/analytics/cta', data),
  getDashboard: (params) => api.get('/analytics/admin', { params }),
  getPropertyAnalytics: (propertyId, params) => api.get(`/analytics/admin/${propertyId}`, { params }),
};

// AI API
export const aiAPI = {
  getStatus: () => api.get('/admin/ai/status'),
  generate: (section, propertyId) => api.post(`/admin/ai/generate/${section}`, { propertyId }),
  saveContent: (propertyId, section, content) => api.put(`/admin/ai/content/${propertyId}/${section}`, content),
  getPropertyContent: (propertyId) => api.get(`/admin/ai/content/${propertyId}`),
};

export default api;