'use client';

import { useState } from 'react';
import BookingTable from './(components)/BookingTable';
import DashboardStats from './(components)/DashboardStats';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'all'>('pending');

  const handleTabChange = (tab: 'pending' | 'confirmed' | 'all') => {
    console.log(`Switching dashboard tab to: ${tab}`);
    setActiveTab(tab);
    toast.success(`Viewing ${tab} bookings`);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardStats />
        
        {/* Booking Management Section */}
        <div className="bg-[#333333] rounded-lg shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Booking Management</h2>
            
            {/* Tabs */}
            <div className="border-b border-gray-700 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => handleTabChange('pending')}
                  className={`${
                    activeTab === 'pending'
                      ? 'border-yellow-400 text-yellow-400'
                      : 'border-transparent text-gray-400 hover:text-yellow-400 hover:border-gray-700'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium transition-all`}
                >
                  Pending Bookings
                </button>
                <button
                  onClick={() => handleTabChange('confirmed')}
                  className={`${
                    activeTab === 'confirmed'
                      ? 'border-yellow-400 text-yellow-400'
                      : 'border-transparent text-gray-400 hover:text-yellow-400 hover:border-gray-700'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium transition-all`}
                >
                  Confirmed Bookings
                </button>
                <button
                  onClick={() => handleTabChange('all')}
                  className={`${
                    activeTab === 'all'
                      ? 'border-yellow-400 text-yellow-400'
                      : 'border-transparent text-gray-400 hover:text-yellow-400 hover:border-gray-700'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium transition-all`}
                >
                  All Bookings
                </button>
              </nav>
            </div>

            {/* Booking Table */}
            <BookingTable status={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
} 