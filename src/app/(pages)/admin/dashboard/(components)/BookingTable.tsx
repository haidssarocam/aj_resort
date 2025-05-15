'use client';

import { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '@/app/(pages)/booking/types';
import { bookingService } from '@/app/api/booking/bookingService';
import { toast } from 'react-hot-toast';

interface BookingTableProps {
  status: 'pending' | 'confirmed' | 'all';
}

// Add a Date formatter that ensures consistent output between server and client
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Add this function at the top level before the component
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(amount);
};

/**
 * BookingTable - Admin component for managing all user bookings
 * 
 * This component uses admin-specific API endpoints:
 * - For filtered status views: /admin/dashboard/bookings/{status}
 * - For all bookings: /bookings (with admin permissions showing all users' bookings)
 * - For status updates: /bookings/{id}/status (admin-only endpoint)
 * 
 * These endpoints are protected by the 'admin' middleware on the backend
 * and should return all bookings across all users, unlike the user-facing
 * booking endpoints that only show the current user's bookings.
 */
export default function BookingTable({ status }: BookingTableProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let bookingsData: Booking[] = [];
      
      // Use the correct admin endpoints for each status
      if (status === 'all') {
        try {
          bookingsData = await bookingService.getAll();
          toast.success(`Loaded ${bookingsData.length} bookings`);
        } catch (err) {
          console.error('Error fetching all bookings:', err);
          setError('Failed to load all bookings.');
          return;
        }
      } else if (status === 'pending') {
        try {
          bookingsData = await bookingService.getPendingBookings();
          toast.success(`Loaded ${bookingsData.length} pending bookings`);
        } catch (err) {
          console.error('Error fetching pending bookings:', err);
          setError('Failed to load pending bookings.');
          return;
        }
      } else if (status === 'confirmed') {
        try {
          bookingsData = await bookingService.getConfirmedBookings();
          toast.success(`Loaded ${bookingsData.length} confirmed bookings`);
        } catch (err) {
          console.error('Error fetching confirmed bookings:', err);
          setError('Failed to load confirmed bookings.');
          return;
        }
      }
      
      // Log the loaded data for debugging
      console.log(`Loaded ${bookingsData.length} ${status} bookings:`, bookingsData);
      
      setBookings(bookingsData);
    } catch (error: any) {
      console.error('Error in fetchBookings:', error);
      setError('Failed to load bookings. Please try again later.');
      toast.error('API error: ' + (error.message || 'Failed to load bookings'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [status]);

  const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await bookingService.updateStatus(bookingId, newStatus);
      toast.success(`Booking ${newStatus} successfully`);
      
      // Optimistically update UI first then fetch in background
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus } 
            : booking
        )
      );
      
      // Refresh bookings in background
      fetchBookings();
    } catch (error: any) {
      console.error(`Error updating booking to ${newStatus}:`, error);
      toast.error(`Failed to update booking status: ${error.message || 'Server error'}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Booking Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {booking.user?.name || 'User #' + booking.user_id}
                </div>
                <div className="text-sm text-gray-500">
                  {booking.user?.email || 'No email provided'}
                </div>
                <div className="text-sm text-gray-500">
                  Booked on {formatDate(booking.created_at)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{booking.cottage_type}</div>
                <div className="text-sm text-gray-500">
                  {booking.quantity} unit(s) • {booking.duration} hours
                </div>
                <div className="text-sm text-gray-500">
                  Accommodation ID: {booking.accommodation_id}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">₱{formatCurrency(booking.total_price)}</div>
                <div className="text-sm text-gray-500">
                  {booking.payment_method === 'credit_card' ? 'Credit Card' : 
                   booking.payment_method === 'gcash' ? 'GCash' : 
                   booking.payment_method === 'cash' ? 'Cash' : 'Bank Transfer'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'}`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(booking.id, 'completed')}
                    className="text-green-600 hover:text-green-900"
                  >
                    Mark Completed
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 