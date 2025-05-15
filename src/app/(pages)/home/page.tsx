'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import HeroSection from '@/app/(pages)/home/(components)/HeroSection';
import AccommodationsSection from '@/app/(pages)/home/(components)/AccommodationsSection';
import ResortRulesSection from '@/app/(pages)/home/(components)/ResortRulesSection';
import LocationSection from '@/app/(pages)/home/(components)/LocationSection';
import AboutSection from '@/app/(pages)/home/(components)/AboutSection';

const images = [
  '/images/home/slideshow/pool.jpg',
  '/images/home/slideshow/resort.jpg',
  '/images/home/slideshow/cottage-1.jpg'
];

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Main Content */}
      <section className="container mx-auto px-4 py-16 space-y-16">
        <AccommodationsSection />
        <ResortRulesSection />
        <LocationSection />
        <AboutSection />
      </section>
    </div>
  );
} 