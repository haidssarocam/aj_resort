'use client';

import { useState, useEffect } from 'react';
import BookingSidebar from '@/app/(pages)/booking/(components)/BookingSidebar';
import CottageGrid from '@/app/(pages)/booking/(components)/CottageGrid';
import BookingModal from '@/app/(pages)/booking/(components)/BookingModal';
import { Accommodation } from '@/app/(pages)/admin/accommodation/types';
import { accommodationService } from '@/app/api/accommodation/accommodationService';
import { toast } from 'react-hot-toast';

export default function BookingPage() {
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch accommodations on component mount
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setIsLoading(true);
        const data = await accommodationService.getAvailable();
        setAccommodations(data);
        setFilteredAccommodations(data);
        toast.success('Available accommodations loaded successfully');
      } catch (error) {
        console.error('Failed to fetch accommodations:', error);
        toast.error('Failed to load accommodations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAccommodations();
  }, []);

  const handleBookingClick = (accommodation: Accommodation) => {
    setSelectedAccommodation(accommodation);
    setIsModalOpen(true);
    toast.success(`Booking form opened for ${accommodation.name}`);
  };

  const handleFilterChange = (filters: { categories: string[]; duration: string }) => {
    // Filter accommodations based on selected categories and duration
    let filtered = [...accommodations];
    
    if (filters.categories.length > 0) {
      filtered = filtered.filter(accommodation => 
        filters.categories.some(category => {
          // Map category names to accommodation types
          if (category.toLowerCase() === 'cottage') return accommodation.type === 'cottage';
          if (category.toLowerCase() === 'room') return accommodation.type === 'room';
          if (category.toLowerCase() === 'tent') return accommodation.type === 'tent';
          return false;
        })
      );
    }

    if (filters.duration) {
      const durationHours = filters.duration.startsWith('3') ? 3 : 22;
      filtered = filtered.filter(accommodation => 
        accommodation.duration_hours === durationHours
      );
    }

    setFilteredAccommodations(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Book Your Stay</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <BookingSidebar onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available Accommodations</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredAccommodations.length > 0 ? (
                <CottageGrid accommodations={filteredAccommodations} onBookNow={handleBookingClick} />
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No accommodations found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {selectedAccommodation && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            accommodation={selectedAccommodation}
          />
        )}
      </div>
    </div>
  );
} 