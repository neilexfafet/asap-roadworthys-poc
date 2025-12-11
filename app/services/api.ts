import axios, { isCancel } from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api', // Your API base URL
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Optional: request timeout
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // You can process the response data here before it's passed to the calling function
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response Error:', error.response.data);
      console.error('Status:', error.response.status);

      if (error.response.status === 401) {
        // Handle unauthorized access, e.g., redirect to login page
        console.log('Unauthorized access. Redirecting to login...');
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error: No response received', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error?.message);
    }
    return Promise.reject(error);
  }
);

export { isCancel };
export default api;