'use client';

import { useState, useEffect } from 'react';

const images = [
  '/images/home/slideshow/pool.jpg',
  '/images/home/slideshow/resort.jpg',
  '/images/home/slideshow/cottage-1.jpg'
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        </div>
      ))}
      <div className="relative z-10 text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white">
          Welcome to Secret Aj Resort
        </h1>
        <p className="text-xl text-white">Experience luxury and comfort in paradise</p>
      </div>
    </section>
  );
} 