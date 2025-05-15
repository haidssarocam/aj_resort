export interface Cottage {
  id: string;
  cottage_type: string;
  time: string;
  price: number;
  image: string;
  description: string;
  capacity: string;
}

export interface BookingFormData {
  accommodation_id: string;
  quantity: number;
  payment_method: PaymentMethod;
}

export type PaymentMethod = 'credit_card' | 'cash' | 'bank_transfer' | 'gcash';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  user_id: string;
  accommodation_id: string;
  cottage_type: string;
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

export interface FilterOptions {
  categories: string[];
  duration: string;
} 