'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminHeader from '@/components/AdminHeader';
import { toast } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  // Protect all admin routes
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        console.log('Admin Layout: User not authenticated, redirecting to login');
        toast.error('Please log in to access the admin area');
        router.replace('/login');
      } else if (!isAdmin) {
        console.log('Admin Layout: User not admin, redirecting to home');
        toast.error('You do not have permission to access the admin area');
        router.replace('/home');
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  // Show nothing during loading or if not authorized
  if (loading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#222222]">
      <AdminHeader />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
} 