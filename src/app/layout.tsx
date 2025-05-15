'use client';

import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

// Content component that determines the layout
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  // Use useEffect to ensure we only run this code on the client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Return a simple loading state for initial server render
  // This ensures consistent rendering between server and client
  if (!mounted) {
    return <>{children}</>;
  }
  
  // Once mounted, we can use client-only logic
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAuthPage) {
    // Auth pages have no layout
    return <>{children}</>;
  } else if (isAdminPage) {
    // Admin pages just render children (they use their own layout)
    return <>{children}</>;
  } else {
    // Regular pages use standard header/footer
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    );
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
