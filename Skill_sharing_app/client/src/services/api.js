import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
});

// Add request interceptor to add auth token
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear token and user data if it's not a logout request
      if (!error.config.url.includes('/logout')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userProfile');
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  console.log('Current token:', token); // Debug log
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Profile API calls
export const profileApi = {
  // Get all profiles
  getAllProfiles: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profiles`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch profiles');
    }
    const profiles = await response.json();
    return profiles.map(profile => ({
      ...profile,
      isDeleted: profile.is_deleted || false,
      deletedAt: profile.deleted_at
    }));
  },

  // Get single profile
  getProfile: async (userId) => {
    try {
      console.log('Making getProfile request for user:', userId); // Debug log
      const response = await api.get(`/profiles/${userId}`, {
        headers: getAuthHeader()
      });
      console.log('getProfile response:', response.data); // Debug log
      return response.data;
  } catch (error) {
      console.error('getProfile error:', error.response?.data || error.message); // Debug log
    throw error;
  }
  },

  // Create profile
  createProfile: async (profileData) => {
    try {
      const response = await api.post('/profiles', profileData);
      return response.data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to create profile');
    }
  },

  // Update profile
  updateProfile: async (userId, profileData) => {
  try {
      const response = await api.put(`/profiles/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Delete profile
  deleteProfile: async (profileId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profiles/${profileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete profile');
    }
    return response.json();
  }
};

// Auth API calls
export const authApi = {
  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Failed to register');
    }
  },

  // Login
  login: async (credentials) => {
    try {
      console.log('Attempting login with:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
  } catch (error) {
      console.error('Get current user error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get current user');
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
  }
}; 