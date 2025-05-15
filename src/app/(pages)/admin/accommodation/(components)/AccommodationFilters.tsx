'use client';

import { useState, useEffect, useCallback } from 'react';
import { AccommodationFilter } from '../types';

interface AccommodationFiltersProps {
  onFilterChange: (filters: AccommodationFilter) => void;
}

export default function AccommodationFilters({ onFilterChange }: AccommodationFiltersProps) {
  const [filters, setFilters] = useState<AccommodationFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Debounced filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value || undefined;
    setFilters(prev => ({ ...prev, type }));
  };
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const duration = e.target.value || undefined;
    setFilters(prev => ({ ...prev, duration }));
  };
  
  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let availability;
    
    if (value === 'true') availability = true;
    else if (value === 'false') availability = false;
    else availability = undefined;
    
    setFilters(prev => ({ ...prev, availability }));
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilters(prev => ({ 
      ...prev, 
      searchQuery: query.length > 0 ? query : undefined 
    }));
  };
  
  const handleReset = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="bg-[#222222] p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium text-white mb-4">Filter Accommodations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name or description"
            className="w-full px-3 py-2 bg-[#444444] border border-gray-700 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
          />
        </div>
        
        {/* Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
            Type
          </label>
          <select
            id="type"
            value={filters.type || ''}
            onChange={handleTypeChange}
            className="w-full px-3 py-2 bg-[#444444] border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
          >
            <option value="">All Types</option>
            <option value="cottage">Cottage</option>
            <option value="room">Room</option>
            <option value="tent">Tent</option>
          </select>
        </div>
        
        {/* Duration Filter */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
            Duration
          </label>
          <select
            id="duration"
            value={filters.duration || ''}
            onChange={handleDurationChange}
            className="w-full px-3 py-2 bg-[#444444] border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
          >
            <option value="">All Durations</option>
            <option value="3 Hours">3 Hours</option>
            <option value="22 Hours">22 Hours</option>
          </select>
        </div>
        
        {/* Availability Filter */}
        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-gray-300 mb-1">
            Availability
          </label>
          <select
            id="availability"
            value={filters.availability === undefined ? '' : String(filters.availability)}
            onChange={handleAvailabilityChange}
            className="w-full px-3 py-2 bg-[#444444] border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>
      </div>
      
      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm text-white bg-[#555555] border border-gray-700 rounded-md shadow-sm hover:bg-[#666666] focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
} 