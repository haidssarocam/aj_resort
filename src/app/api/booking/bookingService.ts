import api from '../axios';
import { Booking, BookingFormData, BookingStatus } from '@/app/(pages)/booking/types';
import { toast } from 'react-hot-toast';

export const bookingService = {
  // Get all bookings (for authenticated users)
  getAll: async (status?: BookingStatus): Promise<Booking[]> => {
    try {
      const params = status ? { status } : {};
      console.log('Calling getAll with params:', params);
      
      const response = await api.get('/bookings', { params });
      console.log('getAll response:', response.status, response.data);
      return response.data.data || [];
    } catch (error: any) {
      console.error('getAll error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      
      // Show more helpful error message based on status code
      if (error.response?.status === 500) {
        toast.error('Server error: The booking API endpoint returned a 500 error. Please check your Laravel logs.');
      }
      
      throw error;
    }
  },

  // Get bookings by status (admin) - Updated to match Laravel routes
  getByStatus: async (status: BookingStatus): Promise<Booking[]> => {
    console.log(`Fetching admin bookings with status: ${status}`);
    
    try {
      // Using the named status endpoint for admin
      const response = await api.get(`/admin/dashboard/bookings/${status}`);
      console.log(`Retrieved admin bookings with status ${status}:`, {
        statusCode: response.status,
        dataCount: response.data?.data?.length || 0,
        firstRecord: response.data?.data?.[0] || null
      });
      
      // Check if the response has the expected format
      if (!response.data || !Array.isArray(response.data.data)) {
        console.warn('Unexpected response format from admin endpoint:', response.data);
        toast.error('Unexpected response format from server');
        return [];
      }
      
      return response.data.data || [];
    } catch (error: any) {
      console.error(`Error calling admin bookings endpoint for status ${status}:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data, 
        statusText: error.response?.statusText,
        url: error.config?.url,
        headers: error.config?.headers
      });
      
      // Show more helpful error message based on status code
      if (error.response?.status === 500) {
        toast.error(`Server error (500) when loading ${status} bookings. Your admin middleware or controller might have an issue.`);
      } else if (error.response?.status === 404) {
        toast.error(`API endpoint not found for ${status} bookings. Verify your routes are configured correctly.`);
      } else if (error.response?.status === 403) {
        toast.error('Permission denied. Verify that your token has admin privileges in your User model.');
      }
      
      throw error;
    }
  },

  // Helper functions for specific statuses (admin)
  getPendingBookings: async (): Promise<Booking[]> => {
    return bookingService.getByStatus('pending');
  },

  getConfirmedBookings: async (): Promise<Booking[]> => {
    return bookingService.getByStatus('confirmed');
  },

  getCompletedBookings: async (): Promise<Booking[]> => {
    return bookingService.getByStatus('completed');
  },

  getCancelledBookings: async (): Promise<Booking[]> => {
    return bookingService.getByStatus('cancelled');
  },

  // Update booking status (admin only) 
  updateStatus: async (id: string, status: BookingStatus): Promise<Booking> => {
    try {
      console.log(`Updating booking ${id} to status: ${status}`);
      // Using the correct admin endpoint for updating status
      const response = await api.patch(`/bookings/${id}/status`, { status });
      console.log('Status update response:', response.status, response.data);
      return response.data.data;
    } catch (error: any) {
      console.error(`Error updating booking ${id} to ${status}:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 500) {
        toast.error(`Server error when updating booking status. Check your Laravel logs for details.`);
      } else if (error.response?.status === 403) {
        toast.error('Permission denied. Only admins can update booking statuses.');
      } else if (error.response?.status === 404) {
        toast.error('Booking not found. It may have been deleted.');
      }
      
      throw error;
    }
  },

  // Get a single booking
  getById: async (id: string): Promise<Booking> => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error(`Error fetching booking with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new booking
  create: async (formData: BookingFormData): Promise<Booking> => {
    try {
      const response = await api.post('/bookings', formData);
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update a booking
  update: async (id: string, formData: Partial<BookingFormData>): Promise<Booking> => {
    try {
      const response = await api.put(`/bookings/${id}`, formData);
      return response.data.data;
    } catch (error: any) {
      console.error(`Error updating booking ${id}:`, error);
      throw error;
    }
  },

  // Delete/Cancel a booking
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/bookings/${id}`);
    } catch (error: any) {
      console.error(`Error deleting booking ${id}:`, error);
      throw error;
    }
  },

  // Approve a booking (shorthand for updating status to confirmed)
  approveBooking: async (id: string): Promise<Booking> => {
    return bookingService.updateStatus(id, 'confirmed');
  },

  // Complete a booking
  completeBooking: async (id: string): Promise<Booking> => {
    return bookingService.updateStatus(id, 'completed');
  },

  // Cancel a booking
  cancelBooking: async (id: string): Promise<Booking> => {
    return bookingService.updateStatus(id, 'cancelled');
  }
}; 