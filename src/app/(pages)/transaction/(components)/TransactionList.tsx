'use client';

import { Transaction } from '../types';
import { useState, useEffect } from 'react';
import React from 'react';
import dynamic from 'next/dynamic';

interface TransactionListProps {
  transactions: Transaction[];
  onUpdateStatus?: (id: string, status: 'pending' | 'accepted' | 'rejected' | 'completed') => void;
}

// Create a dynamic component that only renders on the client
// This completely avoids hydration errors by skipping server-side rendering
const TransactionListClient = dynamic(
  () => Promise.resolve(({ transactions, onUpdateStatus }: TransactionListProps) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
      setExpandedId(expandedId === id ? null : id);
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getStatusMessage = (status: string) => {
      switch (status) {
        case 'pending': return 'Your booking is pending approval.';
        case 'confirmed': return 'Your booking has been confirmed!';
        case 'cancelled': return 'Your booking was cancelled.';
        case 'completed': return 'Your booking has been completed.';
        default: return '';
      }
    };

    return (
      <div className="overflow-x-auto">
        {transactions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No transactions found.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Payment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{transaction.cottage_type}</div>
                      <div className="text-sm text-gray-500">Duration: {transaction.duration}</div>
                      <div className="text-sm text-gray-500">Quantity: {transaction.quantity}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">Check-in: {transaction.check_in_date ? new Date(transaction.check_in_date).toLocaleDateString() : 'N/A'}</div>
                      <div className="text-sm text-gray-500">
                        Payment: {transaction.payment_method === 'credit_card' ? 'Credit Card' : 'GCash'}
                      </div>
                      <div className="text-sm text-gray-500">Total: ₱{transaction.total_price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => toggleExpand(transaction.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        {expandedId === transaction.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                  
                  {expandedId === transaction.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-6 py-4">
                        <div className="flex flex-col gap-3">
                          <div className={`p-3 rounded-md ${getStatusColor(transaction.status)} bg-opacity-20`}>
                            <p className="text-sm">
                              <span className="font-medium">Status: </span>
                              {getStatusMessage(transaction.status)}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Booking Information</h4>
                              <p className="text-sm text-gray-600">Booking ID: {transaction.id}</p>
                              <p className="text-sm text-gray-600">Booking Date: {transaction.created_at ? new Date(transaction.created_at).toLocaleString() : 'N/A'}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Customer Information</h4>
                              <p className="text-sm text-gray-600">Name: {transaction.customer_name}</p>
                              <p className="text-sm text-gray-600">Email: {transaction.customer_email}</p>
                              <p className="text-sm text-gray-600">Phone: {transaction.customer_phone}</p>
                            </div>
                          </div>
                          
                          {transaction.status === 'pending' && (
                            <div className="mt-3 p-3 bg-yellow-50 rounded-md text-sm text-yellow-700">
                              Your booking request is being reviewed by our staff. You'll receive an update soon.
                            </div>
                          )}
                          
                          {transaction.status === 'confirmed' && (
                            <div className="mt-3 p-3 bg-green-50 rounded-md text-sm text-green-700">
                              Your booking has been confirmed. We look forward to welcoming you!
                            </div>
                          )}
                          
                          {transaction.status === 'cancelled' && (
                            <div className="mt-3 p-3 bg-red-50 rounded-md text-sm text-red-700">
                              We're sorry, but your booking request could not be accommodated. 
                              Please contact us for more information.
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }),
  { ssr: false } // This is the key option - it disables server-side rendering completely
);

// Simple loading component for initial client-side render
function TransactionListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
}

// Wrapper component that handles the server/client transition
export default function TransactionList(props: TransactionListProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Server-side or during hydration, display a loading skeleton
  if (!isClient) {
    return <TransactionListSkeleton />;
  }
  
  // Client-side only, after hydration is complete
  return <TransactionListClient {...props} />;
} 