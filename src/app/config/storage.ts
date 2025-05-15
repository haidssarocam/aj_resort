// Storage configuration and constants
// Set a fallback value for when the environment variable is not available
export const API_HOST = process.env.NEXT_PUBLIC_API_HOST || '192.168.1.101:8000';
export const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || `http://${API_HOST}/storage`;

// Default image path for when accommodation images are not available
export const DEFAULT_ACCOMMODATION_IMAGE = '/images/swim1.jpg';

/**
 * Renders the image URL with the provided path.
 * @param {string | File | null | undefined} imagePath - The path or File object of the image.
 * @returns {string} The full URL to the image or a default image.
 */
export const getImageUrl = (imagePath: string | File | null | undefined): string => {
  if (!imagePath) {
    return DEFAULT_ACCOMMODATION_IMAGE;
  }

  if (imagePath instanceof File) {
    return URL.createObjectURL(imagePath);
  }

  if (typeof imagePath === 'string') {
    // If the image path is already a full URL, return it as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Remove any leading slashes from the image path
    const cleanPath = imagePath.replace(/^\/+/, '');
    
    // Ensure there's no double slash when joining URLs
    return `${STORAGE_URL}${STORAGE_URL.endsWith('/') ? '' : '/'}${cleanPath}`;
  }

  return DEFAULT_ACCOMMODATION_IMAGE;
};

// Helper function to get full storage URL for accommodation images - for backward compatibility
export const getAccommodationImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return DEFAULT_ACCOMMODATION_IMAGE;
  }
  
  // If the image path is already a full URL, return it as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Remove any leading slashes from the image path
  const cleanPath = imagePath.replace(/^\/+/, '');
  
  // Ensure there's no double slash when joining URLs
  return `${STORAGE_URL}${STORAGE_URL.endsWith('/') ? '' : '/'}/accommodations/${cleanPath}`;
}; 