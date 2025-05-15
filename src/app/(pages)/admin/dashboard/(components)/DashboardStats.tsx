'use client';

import { useState, useEffect } from 'react';
import { DashboardStats as Stats } from '../types';
import { bookingService } from '@/app/api/booking/bookingService';
import { Booking } from '@/app/(pages)/booking/types';
import { toast } from 'react-hot-toast';

// Format currency function to ensure consistent formatting between server and client
const formatCurrency = (amount: number | null | undefined): string => {
  // Return ₱0.00 if amount is null, undefined, or NaN
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₱0.00';
  }
  
  // Ensure amount is a number
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    return '₱0.00';
  }
  
  // Use a fixed format instead of locale-specific formatting to avoid hydration errors
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(numericAmount);
  
  return '₱' + formatted;
};

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formattedRevenue, setFormattedRevenue] = useState<string>('₱0.00');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all bookings
        let allBookings: Booking[] = [];
        
        try {
          allBookings = await bookingService.getAll();
        } catch (err) {
          console.error('Error fetching bookings for stats:', err);
          setError('Failed to load booking data. Please try again later.');
          setLoading(false);
          return;
        }
        
        // Calculate stats
        const totalBookings = allBookings.length;
        const pendingBookings = allBookings.filter(booking => booking.status === 'pending').length;
        const confirmedBookings = allBookings.filter(booking => booking.status === 'confirmed').length;
        const completedBookings = allBookings.filter(booking => booking.status === 'completed').length;
        const cancelledBookings = allBookings.filter(booking => booking.status === 'cancelled').length;
        
        // Calculate total revenue (only from confirmed and completed bookings)
        const totalRevenue = allBookings
          .filter(booking => booking.status === 'confirmed' || booking.status === 'completed')
          .reduce((total, booking) => total + booking.total_price, 0);
        
        const newStats = {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          cancelledBookings,
          totalRevenue
        };
        
        setStats(newStats);
        setFormattedRevenue(formatCurrency(totalRevenue));
      } catch (error: any) {
        console.error('Error calculating dashboard stats:', error);
        setError('Failed to process dashboard statistics. Please try again later.');
        toast.error('Statistics error: ' + (error.message || 'Could not load dashboard data'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingBookings}</p>
            </div>
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Confirmed Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.confirmedBookings}</p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">{formattedRevenue}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 