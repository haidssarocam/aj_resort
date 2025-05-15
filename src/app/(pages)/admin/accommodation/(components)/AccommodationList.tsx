'use client';

import { Accommodation } from '../types';
import Image from 'next/image';
import React, { useState } from 'react';
import { getImageUrl, DEFAULT_ACCOMMODATION_IMAGE } from '@/app/config/storage';

interface AccommodationListProps {
  accommodations: Accommodation[];
  onEdit: (accommodation: Accommodation) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

// Create a separate component for the accommodation image
function AccommodationImage({ imagePath, altText }: { imagePath: string | null | undefined, altText: string }) {
  const [error, setError] = useState(false);
  const imageUrl = error ? DEFAULT_ACCOMMODATION_IMAGE : getImageUrl(imagePath);

  return (
    <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden relative">
      <Image
        src={imageUrl}
        alt={altText}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'cover' }}
        onError={() => setError(true)}
      />
    </div>
  );
}

export default function AccommodationList({ 
  accommodations,
  onEdit,
  onDelete,
  onToggleAvailability
}: AccommodationListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cottage': return 'Cottage';
      case 'room': return 'Room';
      case 'tent': return 'Tent';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cottage': return 'bg-blue-600 text-white';
      case 'room': return 'bg-purple-600 text-white';
      case 'tent': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      onDelete(id);
    }
  };

  return (
    <div>
      {accommodations.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400">No accommodations found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#222222]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Accommodation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#444444] divide-y divide-gray-700">
              {accommodations.map((accommodation) => (
                <tr key={accommodation.id} className="hover:bg-[#555555]">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <AccommodationImage imagePath={accommodation.image_path} altText={accommodation.name} />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{accommodation.name}</div>
                        <div className="text-sm text-gray-300">ID: {accommodation.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(accommodation.type)} w-fit mb-1`}>
                        {getTypeLabel(accommodation.type)}
                      </span>
                      <div className="text-sm text-white">Duration: {accommodation.duration_hours} Hours</div>
                      <div className="text-sm text-white">Price: ₱{accommodation.price.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Capacity: {accommodation.capacity_min}{accommodation.capacity_max > accommodation.capacity_min ? '-' + accommodation.capacity_max : ''}</div>
                      <div className="text-sm text-gray-300">Units Available: {accommodation.available_units}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${accommodation.is_active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      {accommodation.is_active ? 'Available' : 'Not Available'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(accommodation.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onToggleAvailability(accommodation.id)}
                      className={`mr-3 ${accommodation.is_active ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
                    >
                      {accommodation.is_active ? 'Set Unavailable' : 'Set Available'}
                    </button>
                    <button 
                      onClick={() => onEdit(accommodation)}
                      className="text-yellow-400 hover:text-yellow-300 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => confirmDelete(accommodation.id, accommodation.name)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 