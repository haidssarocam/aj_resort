'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { RegisterCredentials } from '@/app/api/auth/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpPage() {
  const router = useRouter();
  const { register, error, loading: isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: '',
    contact_number: '',
    address: '',
    role: 'customer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'contact_number') {
      // Only allow numbers and limit to 11 digits
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 11);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    if (!validateEmail(formData.email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setValidationError('Passwords do not match');
      return;
    }

    // Create registration data for the API
    const registerData: RegisterCredentials = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      contact_number: formData.contact_number,
      address: formData.address,
      role: formData.role
    };

    try {
      await register(registerData);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen w-screen flex justify-end bg-cover bg-center"
         style={{ backgroundImage: 'url(/images/auth/resort.jpg)' }}>
      <Link 
        href="/" 
        className="fixed left-8 top-8 bg-[#222222]/90 text-white px-6 py-2 rounded-[10px] font-medium hover:bg-[#222222] transition-all duration-300"
      >
        Back to Home
      </Link>
      <div className="min-h-[calc(100vh-4rem)] w-[400px] bg-[#222222]/90 p-8 flex flex-col justify-center mr-20 my-8 rounded-2xl">
        {(validationError || error) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {validationError || error}
          </div>
        )}

        <h1 className="text-white text-[40px] text-center mb-2">Create Account</h1>
        <p className="text-white text-[17px] text-center mb-10">Please Sign Up to proceed</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstname" className="block text-white font-medium mb-2">
              First Name:
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full h-[40px] px-4 bg-[#cccccc] rounded-[10px] hover:bg-white transition-colors text-black"
              required
              placeholder="Johnny"
            />
          </div>

          <div>
            <label htmlFor="lastname" className="block text-white font-medium mb-2">
              Last Name:
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full h-[40px] px-4 bg-[#cccccc] rounded-[10px] hover:bg-white transition-colors text-black"
              required
              placeholder="Doe"
            />
          </div>

          <div>
            <label htmlFor="contact_number" className="block text-white font-medium mb-2">
              Contact Number:
            </label>
            <input
              type="text"
              id="contact_number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              className="w-full h-[40px] px-4 bg-[#cccccc] rounded-[10px] hover:bg-white transition-colors text-black"
              required
              placeholder="09652531451"
              maxLength={11}
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-white font-medium mb-2">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full h-[40px] px-4 bg-[#cccccc] rounded-[10px] hover:bg-white transition-colors text-black"
              required
              placeholder="Your address"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-[40px] px-4 bg-[#cccccc] rounded-[10px] hover:bg-white transition-colors text-black"
              required
              placeholder="johnny@gmail.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white font-medium mb-2">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-[40px] px-4 bg-[#cccccc] rounded-[10px] hover:bg-white transition-colors pr-10 text-black"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-900"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="password_confirmation" className="block text-white font-medium mb-2">
              Confirm Password:
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full h-[40px] px-4 bg-[#cccccc] rounded-[10px] hover:bg-white transition-colors pr-10 text-black"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-900"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[40px] bg-white text-black text-lg font-bold rounded-[50px]
                     hover:bg-black hover:text-white transition-all duration-300
                     disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
          </button>

          <p className="text-center text-white">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-white font-bold no-underline hover:underline hover:text-xl transition-all duration-300"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
} 