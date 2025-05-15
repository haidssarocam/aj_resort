import { BookingStatus, PaymentMethod } from '@/app/(pages)/booking/types';

export interface Booking {
  id: string;
  customer_name: string;
  cottage_type: string;
  duration: number;
  quantity: number;
  total_price: number;
  payment_method: PaymentMethod;
  status: BookingStatus;
  booking_date: string;
  check_in_date: string;
}

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
} 