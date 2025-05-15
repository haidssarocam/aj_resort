'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminHeader() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const getLinkClassName = (path: string) => {
    const baseClasses = "text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-all";
    const isActive = pathname === path;
    return `${baseClasses} ${
      isActive 
        ? "text-yellow-400 bg-[#222222]" 
        : "hover:text-yellow-400 hover:bg-[#222222]"
    }`;
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push('/home');
  };

  return (
    <header className="bg-[#333333] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin/dashboard" className="flex items-center space-x-2">
                <div className="relative w-10 h-10">
                  <Image
                    src="/images/header/ajlogo.jpg"
                    alt="Secret AJ Resort Logo"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold text-white">AJ Resort Admin</span>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/admin/dashboard"
                className={getLinkClassName("/admin/dashboard")}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/accommodation"
                className={getLinkClassName("/admin/accommodation")}
              >
                Accommodations
              </Link>
            </nav>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-[#222222] flex items-center justify-center text-gray-300 hover:text-yellow-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* User menu dropdown */}
              {isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-[#222222] ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                    Hello, {user?.name || 'Admin'}!
                  </div>
                  <Link
                    href="/admin/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-yellow-400 hover:bg-[#333333]"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-yellow-400 hover:bg-[#333333]"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-yellow-400 hover:bg-[#333333]"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 