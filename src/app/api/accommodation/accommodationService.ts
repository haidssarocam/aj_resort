import api from '../axios';
import { Accommodation, AccommodationFormData } from '@/app/(pages)/admin/accommodation/types';

export const accommodationService = {
  // Get all accommodations
  getAll: async (): Promise<Accommodation[]> => {
    const response = await api.get('/accommodations');
    return response.data.data;
  },

  // Get available accommodations (for public booking page)
  getAvailable: async (): Promise<Accommodation[]> => {
    const response = await api.get('/accommodations/available');
    return response.data.data;
  },

  // Get a single accommodation
  getById: async (id: string): Promise<Accommodation> => {
    const response = await api.get(`/accommodations/${id}`);
    return response.data.data;
  },

  // Create a new accommodation
  create: async (formData: AccommodationFormData): Promise<Accommodation> => {
    const data = new FormData();
    
    // Add all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        data.append('image', value);
      } else if (key !== 'image') {
        // Convert boolean to integer for Laravel
        if (typeof value === 'boolean') {
          data.append(key, value ? '1' : '0');
        } else {
          data.append(key, String(value));
        }
      }
    });
    
    // Add a debugging log to see what's being sent
    console.log('Creating accommodation with data:', Object.fromEntries(data.entries()));
    
    const response = await api.post('/accommodations', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Update an accommodation
  update: async (id: string, formData: AccommodationFormData): Promise<Accommodation> => {
    const data = new FormData();
    
    // Using POST with _method=PUT for FormData compatibility with Laravel
    data.append('_method', 'PUT');
    
    // Add all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        data.append('image', value);
      } else if (key !== 'image') {
        // Convert boolean to integer for Laravel
        if (typeof value === 'boolean') {
          data.append(key, value ? '1' : '0');
        } else {
          data.append(key, String(value));
        }
      }
    });
    
    // Add a debugging log to see what's being sent
    console.log('Updating accommodation with data:', Object.fromEntries(data.entries()));
    
    const response = await api.post(`/accommodations/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Delete an accommodation
  delete: async (id: string): Promise<void> => {
    await api.delete(`/accommodations/${id}`);
  },

  // Toggle accommodation availability
  toggleActive: async (id: string): Promise<Accommodation> => {
    const response = await api.patch(`/accommodations/${id}/toggle-active`);
    return response.data.data;
  },
}; 