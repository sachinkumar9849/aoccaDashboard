// src/lib/axios.ts

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_URL || 'https://api.aoc.edu.np/api/v1';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if we are in the browser environment
    if (typeof window !== 'undefined') {
      // Get token from localStorage
      const token = localStorage.getItem('authToken');

      // If token exists, add to headers
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 unauthorized errors
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        // Redirect to login page
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;