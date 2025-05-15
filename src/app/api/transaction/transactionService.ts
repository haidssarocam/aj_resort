import api from '../axios';
import { Transaction } from '@/app/(pages)/transaction/types';
import { BookingStatus } from '@/app/(pages)/booking/types';
import { toast } from 'react-hot-toast';

export const transactionService = {
  // Get all transactions (bookings) for the current user
  // This uses the existing /bookings endpoint which returns the current user's bookings
  getAll: async (): Promise<Transaction[]> => {
    try {
      const response = await api.get('/bookings');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching bookings from API:', error);
      toast.error('Could not load your bookings. Please try again later.');
      return [];
    }
  },

  // Get transactions by status 
  getByStatus: async (status: BookingStatus): Promise<Transaction[]> => {
    try {
      const response = await api.get('/bookings', { params: { status } });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching bookings with status ${status}:`, error);
      toast.error(`Failed to load ${status} bookings. Please try again later.`);
      return [];
    }
  },

  // Get a single transaction
  getById: async (id: string): Promise<Transaction> => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching booking with ID ${id}:`, error);
      toast.error('Could not retrieve booking details.');
      throw new Error('Booking not found or could not be loaded');
    }
  }
}; 