export interface Accommodation {
  id: string;
  name: string;
  type: 'cottage' | 'room' | 'tent';
  description: string;
  capacity_min: number;
  capacity_max: number;
  duration_hours: 3 | 22;
  price: number;
  available_units: number;
  image_path: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccommodationFormData {
  name: string;
  type: 'cottage' | 'room' | 'tent';
  description: string;
  capacity_min: number;
  capacity_max: number;
  duration_hours: 3 | 22;
  price: number;
  available_units: number;
  image: File | null;
  is_active: boolean;
}

export interface AccommodationFilter {
  type?: string;
  duration?: string;
  availability?: boolean;
  searchQuery?: string;
} 