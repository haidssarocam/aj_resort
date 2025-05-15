'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

const Header = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // First ensure component is mounted to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect admin users to admin dashboard if they try to access customer pages
  useEffect(() => {
    if (mounted && isAdmin && isAuthenticated && !pathname?.startsWith('/admin')) {
      router.push('/admin/dashboard');
    }
  }, [isAdmin, isAuthenticated, pathname, router, mounted]);

  // Check authentication status on component mount and when auth context changes
  useEffect(() => {
    if (!mounted) return;
    
    const checkAuth = () => {
      // Check for token in localStorage and cookies
      const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('token') || Cookies.get('token') || Cookies.get('auth_token'))
        : null;
      const hasUser = !!user;
      
      console.log('Header auth check:', { 
        hasToken: !!token, 
        hasUser, 
        isAuthenticated,
        userFromContext: user?.name || 'none'
      });
      
      setIsUserLoggedIn(!!token || hasUser || isAuthenticated);
    };
    
    checkAuth();
    
    // Also check after a short delay to ensure all auth state is loaded
    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, [user, isAuthenticated, mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [mounted]);

  const getLinkClassName = (path: string) => {
    const baseClasses = "text-gray-300 px-3 py-2 rounded transition-all";
    const isActive = pathname === path;
    return `${baseClasses} ${
      isActive 
        ? "bg-[#222222] text-yellow-400" 
        : "hover:text-yellow-400 hover:bg-[#222222]"
    }`;
  };

  const handleLogout = async () => {
    await logout();
    setIsUserLoggedIn(false);
    setIsMobileMenuOpen(false); // Close mobile menu after logout
  };

  // Don't render anything on server to prevent hydration errors
  if (!mounted) {
    return null;
  }

  // Don't render the header for admin users
  if (mounted && isAdmin) {
    return null;
  }

  return (
    <>
      {isLoading && <LoadingScreen />}
      <header className="bg-[#333333] shadow-md">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative w-12 h-12">
                  <Image
                    src="/images/header/ajlogo.jpg"
                    alt="Secret AJ Resort Logo"
                    fill
                    className="rounded-full object-cover"
                    priority
                  />
                </div>
                <span className="text-2xl font-bold text-white">Secret Aj Resort</span>
              </Link>
            </div>

            {/* Center section - Desktop */}
            <ul className="hidden md:flex space-x-6">
              <li>
                <Link href="/home" className={getLinkClassName("/home")}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/booking" className={getLinkClassName("/booking")}>
                  Booking
                </Link>
              </li>
              <li>
                <Link href="/transaction" className={getLinkClassName("/transaction")}>
                  Transaction
                </Link>
              </li>
              <li>
                <Link href="/setting" className={getLinkClassName("/setting")}>
                  Settings
                </Link>
              </li>
            </ul>

            {/* Right section */}
            <div className="hidden md:block">
              {isUserLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">Hello! {user?.name || 'User'}</span>
                  <button 
                    onClick={handleLogout} 
                    className="text-gray-300 hover:text-yellow-400"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-x-2">
                  <Link href="/login" className={getLinkClassName("/login")}>
                    Login
                  </Link>
                  <span className="text-gray-400">|</span>
                  <Link href="/register" className={getLinkClassName("/register")}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Hamburger menu */}
            <button
              className="md:hidden text-2xl text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              ☰
            </button>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-2">
              <Link 
                href="/home" 
                className={getLinkClassName("/home")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/booking" 
                className={getLinkClassName("/booking")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Booking
              </Link>
              <Link 
                href="/transaction" 
                className={getLinkClassName("/transaction")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Transaction
              </Link>
              <Link 
                href="/setting" 
                className={getLinkClassName("/setting")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </Link>
              
              {/* User auth section */}
              {isUserLoggedIn ? (
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <p className="text-gray-300 px-3 py-1">Hello, {user?.name || 'User'}!</p>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left text-gray-300 px-3 py-2 rounded hover:text-yellow-400 hover:bg-[#222222]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-700 pt-2 mt-2 space-y-2">
                  <Link 
                    href="/login" 
                    className={getLinkClassName("/login")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className={getLinkClassName("/register")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header; 