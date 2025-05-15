'use client';

import { useState, useCallback, useEffect } from 'react';
import { Accommodation, AccommodationFilter, AccommodationFormData } from './types';
import AccommodationList from './(components)/AccommodationList';
import AccommodationForm from './(components)/AccommodationForm';
import AccommodationFilters from './(components)/AccommodationFilters';
import { accommodationService } from '@/app/api/accommodation/accommodationService';
import { toast } from 'react-hot-toast';

export default function AccommodationManagementPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch accommodations on component mount
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setIsLoading(true);
        const data = await accommodationService.getAll();
        setAccommodations(data);
        setFilteredAccommodations(data);
        toast.success('Accommodations loaded successfully');
      } catch (error) {
        console.error('Failed to fetch accommodations:', error);
        toast.error('Failed to load accommodations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAccommodations();
  }, []);
  
  // Memoize the filter change handler
  const handleFilterChange = useCallback((filters: AccommodationFilter) => {
    let filtered = [...accommodations];
    
    if (filters.type) {
      filtered = filtered.filter(acc => acc.type === filters.type);
    }
    
    if (filters.duration) {
      const durationHours = filters.duration === '3 Hours' ? 3 : 22;
      filtered = filtered.filter(acc => acc.duration_hours === durationHours);
    }
    
    if (filters.availability !== undefined) {
      filtered = filtered.filter(acc => acc.is_active === filters.availability);
    }
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(acc => 
        acc.name.toLowerCase().includes(query) || 
        acc.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredAccommodations(filtered);
  }, [accommodations]); // Only depends on accommodations array

  const handleAddAccommodation = () => {
    setEditingAccommodation(null);
    setIsFormOpen(true);
  };

  const handleEditAccommodation = (accommodation: Accommodation) => {
    setEditingAccommodation(accommodation);
    setIsFormOpen(true);
  };

  const handleDeleteAccommodation = async (id: string) => {
    try {
      await accommodationService.delete(id);
      
      // Update local state after successful API call
      const updatedAccommodations = accommodations.filter(acc => acc.id !== id);
      setAccommodations(updatedAccommodations);
      setFilteredAccommodations(filteredAccommodations.filter(acc => acc.id !== id));
      
      toast.success('Accommodation deleted successfully');
    } catch (error) {
      console.error('Failed to delete accommodation:', error);
      toast.error('Failed to delete accommodation');
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      const updatedAccommodation = await accommodationService.toggleActive(id);
      
      // Update local state after successful API call
      const updatedAccommodations = accommodations.map(acc => 
        acc.id === id ? updatedAccommodation : acc
      );
      
      setAccommodations(updatedAccommodations);
      setFilteredAccommodations(
        filteredAccommodations.map(acc => 
          acc.id === id ? updatedAccommodation : acc
        )
      );
      
      toast.success('Accommodation status updated successfully');
    } catch (error) {
      console.error('Failed to toggle accommodation status:', error);
      toast.error('Failed to update accommodation status');
    }
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      // Convert the form data to match AccommodationFormData type
      const accommodationFormData: AccommodationFormData = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        // Convert capacity from string to min/max numbers
        capacity_min: parseInt(formData.capacity?.split('-')[0]) || 0,
        capacity_max: parseInt(formData.capacity?.split('-')[1]) || parseInt(formData.capacity) || 0,
        // Convert duration string to hours number
        duration_hours: formData.duration?.includes('3') ? 3 : 22,
        price: typeof formData.price === 'number' ? formData.price : parseFloat(formData.price) || 0,
        available_units: typeof formData.available_units === 'number' ? formData.available_units : 1, // Default to 1 if not provided
        image: formData.image instanceof File ? formData.image : null,
        is_active: formData.available === true
      };
      
      let updatedAccommodation: Accommodation;
      
      if (editingAccommodation) {
        // Update existing accommodation
        updatedAccommodation = await accommodationService.update(editingAccommodation.id, accommodationFormData);
        
        // Update local state after successful API call
        const updatedAccommodations = accommodations.map(acc => 
          acc.id === editingAccommodation.id ? updatedAccommodation : acc
        );
        
        setAccommodations(updatedAccommodations);
        setFilteredAccommodations(
          filteredAccommodations.map(acc => 
            acc.id === editingAccommodation.id ? updatedAccommodation : acc
          )
        );
        
        toast.success('Accommodation updated successfully');
      } else {
        // Add new accommodation
        updatedAccommodation = await accommodationService.create(accommodationFormData);
        
        setAccommodations([...accommodations, updatedAccommodation]);
        setFilteredAccommodations([...filteredAccommodations, updatedAccommodation]);
        
        toast.success('Accommodation created successfully');
      }
      
      setIsFormOpen(false);
      setEditingAccommodation(null);
    } catch (error) {
      console.error('Failed to save accommodation:', error);
      toast.error('Failed to save accommodation');
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingAccommodation(null);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-[#333333] rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">All Accommodations</h2>
            <button
              onClick={handleAddAccommodation}
              className="mt-4 md:mt-0 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              Add New Accommodation
            </button>
          </div>

          <AccommodationFilters onFilterChange={handleFilterChange} />
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <AccommodationList 
              accommodations={filteredAccommodations} 
              onEdit={handleEditAccommodation}
              onDelete={handleDeleteAccommodation}
              onToggleAvailability={handleToggleAvailability}
            />
          )}
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#333333] rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {editingAccommodation ? 'Edit Accommodation' : 'Add New Accommodation'}
            </h2>
            <AccommodationForm 
              initialData={editingAccommodation}
              onSubmit={handleFormSubmit} 
              onCancel={handleFormCancel} 
            />
          </div>
        </div>
      )}
    </div>
  );
} 