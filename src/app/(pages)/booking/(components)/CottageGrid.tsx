'use client';

import Image from 'next/image';
import { Accommodation } from '@/app/(pages)/admin/accommodation/types';
import { getImageUrl, DEFAULT_ACCOMMODATION_IMAGE } from '@/app/config/storage';
import { useState } from 'react';

interface CottageGridProps {
  accommodations: Accommodation[];
  onBookNow: (accommodation: Accommodation) => void;
}

export default function CottageGrid({ accommodations, onBookNow }: CottageGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {accommodations.map((accommodation) => (
        <AccommodationCard 
          key={accommodation.id} 
          accommodation={accommodation} 
          onBookNow={onBookNow} 
        />
      ))}
    </div>
  );
}

// Separate card component to handle image loading
function AccommodationCard({ accommodation, onBookNow }: { 
  accommodation: Accommodation, 
  onBookNow: (accommodation: Accommodation) => void 
}) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = imageError ? DEFAULT_ACCOMMODATION_IMAGE : getImageUrl(accommodation.image_path);
  
  const getDurationText = (hours: number) => {
    return hours === 3 ? '3 Hours' : '22 Hours';
  };
  
  const getCapacityText = () => {
    if (accommodation.capacity_max > accommodation.capacity_min) {
      return `${accommodation.capacity_min}-${accommodation.capacity_max} persons`;
    }
    return `${accommodation.capacity_min} persons`;
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105">
      <div className="relative h-48 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={`${accommodation.name} Image`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="flex flex-col p-4">
        <h3 className="text-xl font-semibold text-gray-800">{accommodation.name}</h3>
        <p className="text-gray-600 text-sm mt-1 mb-4">{accommodation.description}</p>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{getDurationText(accommodation.duration_hours)}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm">{getCapacityText()}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm capitalize">{accommodation.type}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-gray-800">
            ₱{accommodation.price.toLocaleString()}
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${accommodation.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {accommodation.is_active ? 'Available' : 'Not Available'}
          </span>
        </div>

        <button
          onClick={() => onBookNow(accommodation)}
          disabled={!accommodation.is_active}
          className={`w-full py-3 rounded-lg font-medium ${
            accommodation.is_active 
              ? 'bg-blue-600 text-white hover:bg-blue-700 transition-colors' 
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          {accommodation.is_active ? 'Book Now' : 'Not Available'}
        </button>
      </div>
    </div>
  );
} 