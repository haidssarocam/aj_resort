import axios from 'axios';
import { toast } from 'react-hot-toast';

// Laravel API URL from environment variable
const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://192.168.1.101:8000/api';

// Log the API URL being used
if (typeof window !== 'undefined') {
  console.log('Laravel API URL:', LARAVEL_API_URL);
}

// Create axios instance with base config
const api = axios.create({
  baseURL: LARAVEL_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Removing withCredentials to fix CORS issues
  // withCredentials: true,
  // Add timeout to avoid hanging requests
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add X-User-Role header for middleware
      const userRole = localStorage.getItem('userRole');
      if (userRole) {
        config.headers['X-User-Role'] = userRole;
      }
      
      // Log request details for debugging
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        headers: {
          ...config.headers,
          // Hide sensitive info
          Authorization: config.headers.Authorization ? 'Bearer [TOKEN]' : undefined
        },
        data: config.method !== 'get' ? config.data : undefined,
      });
    }
    return config;
  },
  (error) => {
    console.error('API Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    // Log successful response (not the data, to avoid cluttering the console)
    console.log('API Response success:', {
      status: response.status,
      url: response.config.url,
      dataKeys: Object.keys(response.data || {})
    });
    
    // Store user ID if present in response
    if (response.data?.user?.id && typeof window !== 'undefined') {
      localStorage.setItem('userId', response.data.user.id);
      
      // Also store role if present
      if (response.data.user.role) {
        localStorage.setItem('userRole', response.data.user.role);
      }
    }
    return response;
  },
  (error) => {
    // Log error details
    console.error('API Response error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    // Handle different error responses
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        // Handle unauthorized (logged out or token expired)
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        
        // Only redirect on 401 from non-login/register endpoints
        const url = error.config?.url || '';
        if (!url.includes('/login') && !url.includes('/register')) {
          toast.error('Your session has expired. Please login again.');
          window.location.href = '/login';
        }
      } else if (error.response?.status === 403) {
        // Handle forbidden (no permission)
        toast.error('You do not have permission to access this resource.');
        window.location.href = '/unauthorized';
      } else if (error.response?.status === 500) {
        // Handle server errors
        const endpoint = error.config?.url || 'Unknown endpoint';
        toast.error(`Server error (500) occurred for ${endpoint}. Please try again later or contact support.`);
        
        // Log detailed error info for debugging
        console.error('Server error details:', {
          config: error.config,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
      } else if (error.code === 'ECONNABORTED') {
        // Handle timeouts
        toast.error('Request timed out. Please check your network connection.');
      } else if (!error.response) {
        // Handle network errors
        toast.error('Network error. Please check your connection to the server.');
      }
    }
    return Promise.reject(error);
  }
);

export default api; 