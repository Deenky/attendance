import axios from 'axios';

// Create an Axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    // Log outgoing requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different types of errors
    if (!error.response) {
      // Network or server not reachable
      console.error('[API] Network error:', error.message);
      return Promise.reject(new Error('Cannot connect to server. Please make sure the backend is running.'));
    }

    const { status, data } = error.response;

    if (data?.message) {
      // Backend returned a message
      return Promise.reject(new Error(data.message));
    }

    switch (status) {
      case 400:
        return Promise.reject(new Error('Bad Request.'));
      case 401:
        return Promise.reject(new Error('Unauthorized. Please log in.'));
      case 403:
        return Promise.reject(new Error('Forbidden.'));
      case 404:
        return Promise.reject(new Error('Resource not found.'));
      case 500:
        return Promise.reject(new Error('Internal Server Error.'));
      default:
        return Promise.reject(new Error('An unexpected error occurred.'));
    }
  }
);

export default API;
