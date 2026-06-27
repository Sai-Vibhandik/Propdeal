import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Helper to get full URL for uploaded files
export const getFileUrl = (path) => {
  if (!path) return '';
  // If already a full URL (http/https), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // If starts with /uploads, prepend backend URL
  if (path.startsWith('/uploads')) {
    return `${BACKEND_URL}${path}`;
  }
  // Otherwise, assume it's a relative path
  return `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

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
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

// Properties API
export const propertiesAPI = {
  // Public
  getAll: (params) => api.get('/properties', { params }),
  getFeatured: () => api.get('/properties/featured'),
  getBuilders: () => api.get('/properties/builders'),
  getBySlug: (slug) => api.get(`/properties/${slug}`),

  // Preview (admin) - can view draft properties
  getPreviewBySlug: (slug) => api.get(`/properties/preview/${slug}`),

  // Admin
  getAdminAll: (params) => api.get('/properties/admin/all', { params }),
  getAdminOne: (id) => api.get(`/properties/admin/${id}`),
  create: (data) => api.post('/properties/admin', data),
  update: (id, data) => api.put(`/properties/admin/${id}`, data),
  delete: (id) => api.delete(`/properties/admin/${id}`),
  updateStatus: (id, status) => api.put(`/properties/admin/${id}/status`, { status }),
  toggleFeatured: (id) => api.put(`/properties/admin/${id}/featured`),
  assignTelecallers: (id, telecallerIds, distributeLeads) =>
    api.put(`/properties/admin/${id}/telecallers`, { telecallerIds, distributeLeads }),
  toggleDistributeLeads: (id, enabled) =>
    api.put(`/properties/admin/${id}/distribute-leads`, { enabled }),
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
  delete: (id) => api.delete(`/leads/admin/${id}`),
};

// Enquiries API
export const enquiriesAPI = {
  submit: (data) => api.post('/enquiries', data),
  getAdminAll: (params) => api.get('/enquiries/admin', { params }),
  getAdminOne: (id) => api.get(`/enquiries/admin/${id}`),
  updateStatus: (id, status) => api.put(`/enquiries/admin/${id}/status`, { status }),
  addNote: (id, note) => api.post(`/enquiries/admin/${id}/notes`, { note }),
  assign: (id, userId) => api.put(`/enquiries/admin/${id}/assign`, { userId }),
  setFollowUp: (id, date) => api.put(`/enquiries/admin/${id}/followup`, { date }),
  export: (params) => api.get('/enquiries/admin/export', { params, responseType: 'blob' }),
  delete: (id) => api.delete(`/enquiries/admin/${id}`),
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
  getProviders: () => api.get('/admin/ai/providers'),
  generate: (section, propertyId, propertyData) => api.post(`/admin/ai/generate/${section}`, { propertyId, propertyData }),
  saveContent: (propertyId, section, content) => api.put(`/admin/ai/content/${propertyId}/${section}`, content),
  getPropertyContent: (propertyId) => api.get(`/admin/ai/content/${propertyId}`),
};

// Admin API (for telecallers management)
export const adminAPI = {
  getTelecallers: () => api.get('/admin/telecallers'),
  createTelecaller: (data) => api.post('/admin/telecallers', data),
  updateTelecaller: (id, data) => api.put(`/admin/telecallers/${id}`, data),
  deleteTelecaller: (id) => api.delete(`/admin/telecallers/${id}`),
  resetTelecallerPassword: (id, password) =>
    api.put(`/admin/telecallers/${id}/reset-password`, { password }),
};

// Telecaller API (for telecaller dashboard)
export const telecallerAPI = {
  getMyProperties: () => api.get('/telecaller/my-properties'),
  getMyLeads: (params) => api.get('/telecaller/my-leads', { params }),
  updateLeadStatus: (leadId, status) => api.put(`/telecaller/my-leads/${leadId}/status`, { status }),
  getMyEnquiries: (params) => api.get('/telecaller/my-enquiries', { params }),
  updateEnquiryStatus: (enquiryId, status) => api.put(`/telecaller/my-enquiries/${enquiryId}/status`, { status }),
  exportLeads: (params) => api.get('/telecaller/my-leads/export', { params, responseType: 'blob' }),
  exportEnquiries: (params) => api.get('/telecaller/my-enquiries/export', { params, responseType: 'blob' }),
};

// Site Content API (for public website content management)
export const siteContentAPI = {
  // Public
  getContent: () => api.get('/site-content'),

  // Admin
  getAdminContent: () => api.get('/site-content/admin'),
  updateHeroSlides: (slides) => api.put('/site-content/admin/hero-slides', { slides }),
  updateWhyUs: (data) => api.put('/site-content/admin/why-us', data),
  updateCities: (cities) => api.put('/site-content/admin/cities', { cities }),
  updateTestimonials: (testimonials) => api.put('/site-content/admin/testimonials', { testimonials }),
  updateFAQs: (faqs) => api.put('/site-content/admin/faqs', { faqs }),
  updateContact: (data) => api.put('/site-content/admin/contact', data),
  updateSocial: (data) => api.put('/site-content/admin/social', data),
  updateSEO: (data) => api.put('/site-content/admin/seo', data),
  updateBranding: (data) => api.put('/site-content/admin/branding', data),
  updateFooter: (data) => api.put('/site-content/admin/footer', data),
  updateFooterLinks: (links) => api.put('/site-content/admin/footer-links', { links }),
  updateFooterSocialLinks: (socialLinks) => api.put('/site-content/admin/footer-social-links', { socialLinks }),
  updateFeaturedBuilders: (builders) => api.put('/site-content/admin/featured-builders', { builders }),
  updatePrivacyPolicy: (content) => api.put('/site-content/admin/privacy-policy', { content }),
  updateTermsOfService: (content) => api.put('/site-content/admin/terms-of-service', { content }),
  resetContent: () => api.post('/site-content/admin/reset'),
};

export default api;