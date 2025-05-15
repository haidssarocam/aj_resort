'use client';

import { useState } from 'react';
import { FilterOptions } from '@/app/(pages)/booking/types';

interface BookingSidebarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const CATEGORIES = [
  { id: 'cottages', label: 'Cottages' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'tents', label: 'Tents' },
];

const DURATIONS = [
  { id: 'all', label: 'All Durations' },
  { id: '3', label: '3 Hours (Day Use)' },
  { id: '22', label: '22 Hours (Overnight)' },
];

export default function BookingSidebar({ onFilterChange }: BookingSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [duration, setDuration] = useState('all');

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(c => c !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newCategories);
  };

  const handleDurationChange = (newDuration: string) => {
    setDuration(newDuration);
  };

  const handleApplyFilters = () => {
    onFilterChange({ 
      categories: selectedCategories, 
      duration: duration === 'all' ? '' : duration 
    });
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setDuration('all');
    onFilterChange({ categories: [], duration: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Filters</h2>
        <p className="text-gray-600 text-sm">Find your perfect accommodation</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Category</h3>
          <div className="space-y-2">
            {CATEGORIES.map(category => (
              <label key={category.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                />
                <span className="text-gray-700">{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Duration</h3>
          <div className="space-y-2">
            {DURATIONS.map(durationOption => (
              <label key={durationOption.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  name="duration"
                  value={durationOption.id}
                  checked={duration === durationOption.id}
                  onChange={(e) => handleDurationChange(e.target.value)}
                />
                <span className="text-gray-700">{durationOption.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <button
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
        
        <button
          className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          onClick={handleReset}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
} 