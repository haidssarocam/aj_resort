'use client';

import { useState } from 'react';
import { TransactionFilters } from '../types';
import { BookingStatus } from '@/app/(pages)/booking/types';

interface TransactionFiltersPanelProps {
  onFilterChange: (filters: TransactionFilters) => void;
  onReset?: () => void;
}

export default function TransactionFiltersPanel({ onFilterChange, onReset }: TransactionFiltersPanelProps) {
  const [status, setStatus] = useState<BookingStatus | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as BookingStatus | '';
    setStatus(newStatus);
    
    const filters: TransactionFilters = {};
    if (newStatus) {
      filters.status = newStatus as BookingStatus;
    }
    
    if (startDate && endDate) {
      filters.dateRange = { start: startDate, end: endDate };
    }
    
    onFilterChange(filters);
  };

  const handleDateRangeChange = () => {
    if (!startDate || !endDate) return;
    
    const filters: TransactionFilters = {};
    if (status) {
      filters.status = status as BookingStatus;
    }
    
    filters.dateRange = { start: startDate, end: endDate };
    onFilterChange(filters);
  };

  const handleReset = () => {
    setStatus('');
    setStartDate('');
    setEndDate('');
    onFilterChange({});
    
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Filters</h3>
      
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={handleStatusChange}
          className="block w-full px-3 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      <div>
        <h4 className="block text-sm font-medium text-gray-700 mb-3">Check-in Date Range</h4>
        <div className="space-y-3">
          <div>
            <label htmlFor="start-date" className="block text-sm text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full px-3 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm text-gray-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full px-3 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <button
            onClick={handleDateRangeChange}
            disabled={!startDate || !endDate}
            className="mt-3 w-full inline-flex justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Apply Date Filter
          </button>
        </div>
      </div>
      
      <div>
        <button
          onClick={handleReset}
          className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset All Filters
        </button>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="bg-yellow-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Booking Status
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {status === 'pending' ? 'You have pending bookings awaiting approval.' : 
                   status === 'confirmed' ? 'Your confirmed bookings are ready.' :
                   status === 'cancelled' ? 'These bookings were cancelled.' :
                   status === 'completed' ? 'These bookings have been completed.' :
                   'Use filters to find specific bookings.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 