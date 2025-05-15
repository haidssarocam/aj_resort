import { BookingStatus, PaymentMethod } from '@/app/(pages)/booking/types';

export interface Transaction {
  id: string;
  accommodation_id: string;
  cottage_type: string; // Legacy field, represents accommodation name
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  check_in_date?: string;
  duration: number;
  quantity: number;
  total_price: number;
  payment_method: PaymentMethod;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  accommodation?: {
    id: string;
    name: string;
    type: string;
    duration_hours: number;
    price: number;
  };
}

export interface TransactionFilters {
  status?: BookingStatus;
  dateRange?: {
    start: string;
    end: string;
  };
} 