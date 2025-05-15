'use client';

import { redirect } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function Page() {
  const { isAdmin, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // If user is admin, redirect to admin dashboard
    if (isAdmin) {
      window.location.href = '/admin/dashboard';
    } else {
      // Otherwise redirect to home page
      window.location.href = '/home';
    }
  }, [isAdmin, isAuthenticated]);
  
  // Return loading state while redirect happens
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
