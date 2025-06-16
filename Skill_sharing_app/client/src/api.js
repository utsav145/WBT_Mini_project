// client/src/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = async (form) => {
  try {
    const res = await api.post('/register', {
      name: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword
    });
    return res;
  } catch (err) {
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(err.response.data.msg || 'Registration failed');
    } else if (err.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up request');
    }
  }
};

export const login = async (form) => {
  try {
    const res = await api.post('/login', {
      email: form.email,
      password: form.password
    });
    return res;
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.msg || 'Login failed');
    } else if (err.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Error setting up request');
    }
  }
};

export const deleteAccount = async (userId) => {
  try {
    const res = await api.delete(`/users/delete-account/${userId}`);
    return res;
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.msg || 'Account deletion failed');
    } else if (err.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Error setting up request');
    }
  }
};
