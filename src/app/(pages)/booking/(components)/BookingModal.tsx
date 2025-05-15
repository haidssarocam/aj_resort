'use client';

import { useState, useEffect } from 'react';
import { Accommodation } from '@/app/(pages)/admin/accommodation/types';
import { BookingFormData, PaymentMethod } from '@/app/(pages)/booking/types';
import { bookingService } from '@/app/api/booking/bookingService';
import { toast } from 'react-hot-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  accommodation: Accommodation | null;
}

export default function BookingModal({ isOpen, onClose, accommodation }: BookingModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (accommodation) {
      setTotalPrice(accommodation.price * quantity);
    }
  }, [accommodation, quantity]);

  // Reset form when modal opens with a new accommodation
  useEffect(() => {
    if (isOpen && accommodation) {
      setQuantity(1);
      setPaymentMethod('credit_card');
      setTotalPrice(accommodation.price);
    }
  }, [isOpen, accommodation]);

  if (!isOpen || !accommodation) return null;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > accommodation.available_units) {
      toast.error(`Maximum available units: ${accommodation.available_units}`);
      setQuantity(accommodation.available_units);
    } else if (newQuantity < 1) {
      toast.error('Minimum quantity is 1');
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
      toast.success(`Updated to ${newQuantity} unit(s)`);
    }
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const method = e.target.value as PaymentMethod;
    setPaymentMethod(method);
    
    const methodNames = {
      credit_card: 'Credit Card',
      gcash: 'GCash',
      cash: 'Cash',
      bank_transfer: 'Bank Transfer'
    };
    
    toast.success(`Payment method set to ${methodNames[method]}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const formData: BookingFormData = {
        accommodation_id: accommodation.id,
        quantity,
        payment_method: paymentMethod,
      };

      await bookingService.create(formData);
      
      toast.success('Booking submitted successfully! Waiting for confirmation.');
      onClose();
    } catch (error: any) {
      console.error('Booking submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) {
      toast.error('Please wait while your booking is being processed');
      return;
    }
    onClose();
    toast.success('Booking canceled');
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Book {accommodation.name}</h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Accommodation Type</label>
            <input
              type="text"
              value={accommodation.name}
              className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white/50 text-gray-800 font-medium"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Duration</label>
            <input
              type="text"
              value={accommodation.duration_hours === 3 ? '3 Hours' : '22 Hours'}
              className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white/50 text-gray-800 font-medium"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              max={accommodation.available_units}
              value={quantity}
              onChange={handleQuantityChange}
              className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800"
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500 mt-1">
              Available: {accommodation.available_units} unit{accommodation.available_units !== 1 ? 's' : ''}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Total Price</label>
            <input
              type="text"
              value={`₱${totalPrice.toLocaleString()}`}
              className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white/50 text-gray-800 font-medium"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800"
              disabled={isSubmitting}
            >
              <option value="credit_card">Credit Card</option>
              <option value="gcash">GCash</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-lg font-medium flex items-center justify-center min-w-[120px] ${
                isSubmitting 
                  ? 'bg-blue-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 