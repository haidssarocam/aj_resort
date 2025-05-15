import api from '../axios';
import Cookies from 'js-cookie';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
  contact_number: string;
  address: string;
  role: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';  // Explicitly define the role types to match Laravel
}

const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // Try multiple sources
    return localStorage.getItem('token') || 
           Cookies.get('token') || 
           Cookies.get('auth_token') || 
           null;
  }
  return null;
};

const setToken = async (token: string, user?: User): Promise<void> => {
  if (typeof window !== 'undefined') {
    console.log('Setting token in auth service:', { token: token.substring(0, 10) + '...', user: user?.name });
    
    // Set in localStorage for client-side access
    localStorage.setItem('token', token);
    
    // Set directly in cookies (client-side accessible)
    Cookies.set('token', token, { expires: 30, path: '/' });
    
    // Set user role if available
    if (user?.role) {
      localStorage.setItem('userRole', user.role);
      Cookies.set('userRole', user.role, { expires: 30, path: '/' });
    }
    
    // Set user id if available
    if (user?.id) {
      localStorage.setItem('userId', user.id);
    }
    
    // Set a direct cookie for the user data
    if (user) {
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.error('Error storing user in localStorage', e);
      }
    }
    
    // Set HttpOnly cookie via API
    try {
      await fetch('/api/auth/cookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'set', 
          token,
          role: user?.role 
        }),
      });
    } catch (error) {
      console.error('Error setting secure cookie:', error);
    }
  }
};

const removeToken = async (): Promise<void> => {
  if (typeof window !== 'undefined') {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    
    // Clear client-side cookies
    Cookies.remove('token');
    Cookies.remove('userRole');
    Cookies.remove('auth_token');
    
    // Clear HttpOnly cookie via API
    try {
      await fetch('/api/auth/cookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'clear' }),
      });
    } catch (error) {
      console.error('Error clearing secure cookie:', error);
    }
  }
};

export const authService = {
  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    try {
      console.log('Registering user with credentials:', { ...credentials, password: '***', password_confirmation: '***' });
      const response = await api.post('/register', credentials);
      console.log('Registration response:', response.data);
      
      if (response.data.token) {
        await setToken(response.data.token, response.data.user);
      }
      return response.data;
    } catch (error: any) {
      console.error('Registration error details:', { 
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      throw error;
    }
  },

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      console.log('Logging in with email:', credentials.email);
      console.log('API base URL:', api.defaults.baseURL);
      
      const response = await api.post('/login', credentials);
      console.log('Login response:', response.data);
      
      // Extract user data and token from the response
      const userData = response.data.data;  // Get user from nested data object
      const token = response.data.access_token;
      
      if (token) {
        // Create a proper user object from the response data
        const user: User = {
          id: userData.id.toString(),
          name: userData.firstname + ' ' + userData.lastname,
          email: userData.email,
          role: userData.role
        };
        
        // Pass the user object to set user role in cookies
        await setToken(token, user);
        
        // Force a window level storage of user role
        if (typeof window !== 'undefined' && user.role) {
          window.localStorage.setItem('userRole', user.role);
          Cookies.set('userRole', user.role, { expires: 30, path: '/' });
          document.cookie = `userRole=${user.role}; path=/; max-age=${60 * 60 * 24 * 30}`;
        }
        
        return { user, token };
      }
      throw new Error('No token received from server');
    } catch (error: any) {
      console.error('Login error details:', { 
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      const token = getToken();
      if (token) {
        await api.post('/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await removeToken();
    }
  },

  async getUser(): Promise<User | null> {
    try {
      // First try to get from localStorage
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            return JSON.parse(storedUser);
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }
      }
      
      const token = getToken();
      if (!token) return null;
      
      // Get current user's info
      const userId = this.getUserId();
      if (!userId) return null;
      
      const response = await api.get(`/users/${userId}`);
      const userData = response.data.user || response.data;
      
      // Store for future use
      if (typeof window !== 'undefined' && userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return userData;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  getUserId(): string | null {
    // Get user ID from token or localStorage
    // In a real app with proper JWT handling, you would decode the token
    const token = getToken();
    // This implementation assumes you have the user ID stored somewhere
    // or can extract it from the token
    return token ? localStorage.getItem('userId') || 'current' : null;
  },

  isAuthenticated(): boolean {
    const hasToken = !!getToken();
    if (typeof window !== 'undefined') {
      console.log('Auth check - isAuthenticated:', {
        hasToken,
        localStorageToken: !!localStorage.getItem('token'),
        cookieToken: !!Cookies.get('token'),
        authCookieToken: !!Cookies.get('auth_token')
      });
    }
    return hasToken;
  },

  isAdmin(user: User | null): boolean {
    return user?.role === 'admin';  // Exact match for 'admin'
  },

  getRedirectPath(user: User | null): string {
    if (!user) return '/login';
    // Explicit role check
    return user.role === 'admin' ? '/admin/dashboard' : '/home';
  }
}; 