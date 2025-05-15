'use client';

import { useState, useEffect } from 'react';
import { Accommodation, AccommodationFormData } from '../types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getImageUrl, DEFAULT_ACCOMMODATION_IMAGE } from '@/app/config/storage';
import { toast } from 'react-hot-toast';

// Interface for our internal form state, which is different from AccommodationFormData
interface FormState {
  name: string;
  type: 'cottage' | 'room' | 'tent';
  duration: string;
  price: number;
  image: File | null;
  description: string;
  capacity: string;
  available: boolean;
  available_units?: number;
}

interface AccommodationFormProps {
  initialData: Accommodation | null;
  onSubmit: (formData: Record<string, any>) => void;
  onCancel: () => void;
}

// Create a separate component for the image preview
function ImagePreview({ imageSrc, altText }: { imageSrc: string | File | null, altText: string }) {
  const [error, setError] = useState(false);
  const imageUrl = error ? DEFAULT_ACCOMMODATION_IMAGE : getImageUrl(imageSrc);

  return (
    <div className="h-48 w-full relative">
      <Image
        src={imageUrl}
        alt={altText}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'cover' }}
        className="rounded-md"
        onError={() => setError(true)}
      />
    </div>
  );
}

export default function AccommodationForm({ 
  initialData, 
  onSubmit, 
  onCancel 
}: AccommodationFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormState>({
    name: '',
    type: 'cottage',
    duration: '22 Hours',
    price: 0,
    image: null,
    description: '',
    capacity: '',
    available: true,
    available_units: 1
  });
  const [previewImage, setPreviewImage] = useState<string | File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isImageChanged, setIsImageChanged] = useState(false);

  useEffect(() => {
    if (initialData) {
      // Populate form with existing data
      setFormData({
        name: initialData.name,
        type: initialData.type,
        duration: initialData.duration_hours === 3 ? '3 Hours' : '22 Hours',
        price: initialData.price,
        image: null, // We can't populate a File object from a URL
        description: initialData.description,
        capacity: `${initialData.capacity_min}${initialData.capacity_max > initialData.capacity_min ? '-' + initialData.capacity_max : ''}`,
        available: initialData.is_active,
        available_units: initialData.available_units
      });
      setPreviewImage(initialData.image_path);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field when user changes it
    if (errors[name as keyof FormState]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size exceeds 5MB limit');
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewImage(file);
      setIsImageChanged(true);
      toast.success('Image uploaded successfully');
    }
    
    // Clear error for image when user changes it
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.capacity.trim()) {
      newErrors.capacity = 'Capacity is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Only require image for new accommodations
    if (!initialData && !formData.image) {
      newErrors.image = 'Image is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the form errors before submitting');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // If we're editing and the image hasn't changed, pass the existing image URL
      const formDataForSubmission = {
        ...formData,
        // For internal form processing, convert to the format expected by the page component
        duration_hours: formData.duration.includes('3') ? 3 : 22,
        capacity_min: parseInt(formData.capacity.split('-')[0]) || 0,
        capacity_max: parseInt(formData.capacity.split('-')[1]) || parseInt(formData.capacity) || 0,
        is_active: formData.available,
        image: !isImageChanged && initialData ? initialData.image_path : formData.image
      };
      
      onSubmit(formDataForSubmission);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[#333333] rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold text-white mb-6">
          {initialData ? 'Edit Accommodation' : 'Add New Accommodation'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full bg-[#444444] border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300">
                  Type*
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full bg-[#444444] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                >
                  <option value="cottage">Cottage</option>
                  <option value="room">Room</option>
                  <option value="tent">Tent</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-300">
                  Duration*
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full bg-[#444444] border ${errors.duration ? 'border-red-500' : 'border-gray-700'} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm`}
                >
                  <option value="3 Hours">3 Hours</option>
                  <option value="22 Hours">22 Hours</option>
                </select>
                {errors.duration && <p className="mt-1 text-sm text-red-400">{errors.duration}</p>}
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                  Price (₱)*
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="100"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full bg-[#444444] border ${errors.price ? 'border-red-500' : 'border-gray-700'} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm`}
                />
                {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price}</p>}
              </div>

              {/* Capacity */}
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-300">
                  Capacity*
                </label>
                <input
                  type="text"
                  id="capacity"
                  name="capacity"
                  placeholder="e.g. 4-6 persons"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full bg-[#444444] border ${errors.capacity ? 'border-red-500' : 'border-gray-700'} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm`}
                />
                {errors.capacity && <p className="mt-1 text-sm text-red-400">{errors.capacity}</p>}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full bg-[#444444] border ${errors.description ? 'border-red-500' : 'border-gray-700'} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm`}
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
              </div>

              {/* Image */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-300">
                  {initialData ? 'Image (Optional)' : 'Image*'}
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`block w-full px-3 py-2 bg-[#444444] border ${errors.image ? 'border-red-500' : 'border-gray-700'} rounded-md shadow-sm text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm`}
                  />
                </div>
                {errors.image && <p className="mt-1 text-sm text-red-400">{errors.image}</p>}
              </div>

              {/* Image Preview */}
              {previewImage && (
                <div className="mt-4">
                  <p className="block text-sm font-medium text-gray-300 mb-2">
                    Image Preview
                  </p>
                  <ImagePreview imageSrc={previewImage} altText="Preview" />
                </div>
              )}

              {/* Availability */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 bg-[#444444] border-gray-700 rounded"
                />
                <label htmlFor="available" className="ml-2 block text-sm text-gray-300">
                  Available for booking
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-700 shadow-sm text-sm font-medium rounded-md text-white bg-[#555555] hover:bg-[#666666] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              {initialData ? 'Update Accommodation' : 'Create Accommodation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 