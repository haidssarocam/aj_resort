'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { LoginCredentials } from '@/app/api/auth/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();
  const { login, error: authError, loading: isLoading, clearError, user, isAdmin } = useAuth();

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Check if user is logged in and redirect if needed
  useEffect(() => {
    if (user) {
      console.log('Login page: User already logged in', user);
      const targetPath = user.role === 'admin' ? '/admin/dashboard' : '/home';
      console.log('Login page: Redirecting to', targetPath);
      router.push(targetPath);
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    // Clear errors when user types
    setLocalError(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    // Basic validation
    if (!credentials.email) {
      setLocalError('Email is required');
      return;
    }
    
    if (!credentials.password) {
      setLocalError('Password is required');
      return;
    }
    
    try {
      console.log('Login page: Submitting login form');
      const userData = await login(credentials);
      
      // Force navigation based on user role
      if (userData?.role === 'admin') {
        console.log('Login successful - admin user. Redirecting to dashboard...');
        // Manual redirect
        window.location.href = '/admin/dashboard';
      } else {
        console.log('Login successful - regular user. Redirecting to home...');
        // Manual redirect
        window.location.href = '/home';
      }
    } catch (error: any) {
      console.error('Login page error:', error);
      // Error is already handled by the AuthContext
    }
  };

  // Use local error or auth error
  const displayError = localError || authError;

  return (
    <div className="min-h-screen w-screen flex justify-end bg-cover bg-center"
         style={{ backgroundImage: 'url(/images/auth/resort.jpg)' }}>
      <Link 
        href="/" 
        className="fixed left-8 top-8 bg-[#222222]/90 text-white px-6 py-2 rounded-[10px] font-medium hover:bg-[#222222] transition-all duration-300"
      >
        Back to Home
      </Link>
      <div className="min-h-[calc(100vh-4rem)] w-[400px] bg-[#222222]/90 p-8 flex flex-col justify-center mr-20 my-8 rounded-2xl">
        {displayError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {displayError}
          </div>
        )}

        <h1 className="text-white text-[40px] text-center mb-2">Welcome Back</h1>
        <p className="text-white text-[17px] text-center mb-10">Please Login to proceed</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full h-[40px] px-4 bg-[#cccccc] rounded-[10px] hover:bg-white transition-colors text-black"
              required
              placeholder="johnny@gmail.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white font-medium mb-2">
              Enter your Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full h-[40px] px-4 bg-[#cccccc] rounded-[10px] hover:bg-white transition-colors pr-10 text-black"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-900"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[40px] bg-white text-black text-lg font-bold rounded-[50px]
                     hover:bg-black hover:text-white transition-all duration-300
                     disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
          </button>

          <p className="text-center text-white">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="text-white font-bold no-underline hover:underline hover:text-xl transition-all duration-300"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
} 