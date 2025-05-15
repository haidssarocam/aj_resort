import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User, LoginCredentials, RegisterCredentials } from '@/app/api/auth/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isAuthenticated: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Clear error function
  const clearError = () => setError(null);

  // Update X-User-Role header when user changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user && user.role) {
        // Set a custom header for the middleware to check user role
        localStorage.setItem('userRole', user.role);
        console.log('User role set in localStorage:', user.role);
      } else {
        localStorage.removeItem('userRole');
      }
    }
  }, [user]);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        if (authService.isAuthenticated()) {
          console.log('Auth check: User is authenticated, fetching user data');
          const user = await authService.getUser();
          console.log('Auth check: User data retrieved:', user);
          setUser(user);
        } else {
          console.log('Auth check: User is not authenticated');
        }
      } catch (error) {
        console.error('Auth status check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      console.log('AuthContext: Attempting login with credentials', { email: credentials.email });
      const { user, token } = await authService.login(credentials);
      console.log('AuthContext: Login successful, received user data:', user);
      setUser(user);
      
      // Ensure user role is properly set
      if (user.role) {
        localStorage.setItem('userRole', user.role);
        document.cookie = `userRole=${user.role}; path=/; max-age=${60 * 60 * 24 * 30}`;
      }
      
      // Determine redirect path based on role
      const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/home';
      console.log('AuthContext: Redirecting to', redirectPath);
      
      // Use router.replace instead of push to avoid back button issues
      setTimeout(() => {
        console.log('AuthContext: Executing redirect now to', redirectPath);
        router.replace(redirectPath);
      }, 100);
      
      return user;
    } catch (error: any) {
      console.error('AuthContext: Login error', error);
      let errorMessage = 'Login failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Specific error handling for network issues
      if (error.message?.includes('Network Error') || !error.response) {
        errorMessage = 'Could not connect to the server. Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      console.log('AuthContext: Attempting registration');
      const response = await authService.register(credentials);
      console.log('AuthContext: Registration successful');
      setUser(response.user);
      
      // Redirect based on user role
      const redirectPath = authService.getRedirectPath(response.user);
      console.log('AuthContext: Redirecting to', redirectPath);
      router.push(redirectPath);
      
      return response.user;
    } catch (error: any) {
      console.error('AuthContext: Registration error', error);
      let errorMessage = 'Registration failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Specific error handling for network issues
      if (error.message?.includes('Network Error') || !error.response) {
        errorMessage = 'Could not connect to the server. Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      // Clear user role and auth data
      localStorage.removeItem('userRole');
      document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setUser(null);
      router.push('/'); // Redirect to root which will then redirect to home
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout, 
      clearError,
      isAdmin: user?.role === 'admin', 
      isAuthenticated: authService.isAuthenticated() 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 