"use client";

import { useState, useEffect, useRef } from "react";
import { GraduationCap, Building2 } from "lucide-react";
import Image from "next/image";

const destinations = [
  {
    name: "Study in New Zealand",
    city: "Auckland",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='nz' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2364B5F6'/%3E%3Cstop offset='100%25' style='stop-color:%231976D2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23nz)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='0.3em'%3E🏔️ New Zealand%3C/text%3E%3C/svg%3E",
    universityLogo: "/logo.png",
    description: "Experience world-class education in stunning natural landscapes"
  },
  {
    name: "Study in Malaysia",
    city: "Kuala Lumpur",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='my' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FF7043'/%3E%3Cstop offset='100%25' style='stop-color:%23D84315'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23my)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='0.3em'%3E🏙️ Malaysia%3C/text%3E%3C/svg%3E",
    universityLogo: "/logo.png",
    description: "Affordable quality education in a multicultural environment"
  },
  {
    name: "Study in Japan",
    city: "Tokyo",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='jp' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23E91E63'/%3E%3Cstop offset='100%25' style='stop-color:%23AD1457'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23jp)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='0.3em'%3E🏯 Japan%3C/text%3E%3C/svg%3E",
    universityLogo: "/logo.png",
    description: "Immerse yourself in cutting-edge technology and rich culture"
  },
  {
    name: "Study in Europe",
    city: "Berlin",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='eu' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%234CAF50'/%3E%3Cstop offset='100%25' style='stop-color:%23388E3C'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23eu)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='0.3em'%3E🏛️ Europe%3C/text%3E%3C/svg%3E",
    universityLogo: "/logo.png",
    description: "Explore diverse cultures and world-renowned universities"
  },
  {
    name: "Study in Dubai",
    city: "Dubai",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='ae' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FF9800'/%3E%3Cstop offset='100%25' style='stop-color:%23F57C00'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23ae)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='0.3em'%3E🏗️ Dubai%3C/text%3E%3C/svg%3E",
    universityLogo: "/logo.png",
    description: "Gateway to the Middle East with modern infrastructure"
  },
  {
    name: "Study in Indonesia",
    city: "Jakarta",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='id' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%239C27B0'/%3E%3Cstop offset='100%25' style='stop-color:%237B1FA2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23id)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='0.3em'%3E🏝️ Indonesia%3C/text%3E%3C/svg%3E",
    universityLogo: "/logo.png",
    description: "Discover Southeast Asian culture and growing opportunities"
  }
];

export default function DestinationsSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const maxSlide = Math.max(0, destinations.length - 3);
        return prev >= maxSlide ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
   }, [isAutoScrolling]);

   const goToSlide = (index: number) => {
     setCurrentSlide(index);
     setIsAutoScrolling(false);
    // Resume auto-scroll after 10 seconds
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const nextSlide = () => {
    const maxSlide = Math.max(0, destinations.length - 3); // Show 3 cards at once
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <section className="section-muted">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            Gain Access to Top Institutions across the Globe
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore world-class universities and colleges in your preferred destination
          </p>
        </div>
        
        <div className="relative">
          {/* Slider controls */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              aria-label="Previous destination"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex space-x-2">
              {Array.from({ length: Math.max(1, destinations.length - 2) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide 
                      ? 'bg-blue-600 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              aria-label="Next destination"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Destination cards */}
          <div className="overflow-hidden" ref={sliderRef}>
            <div 
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 320}px)` }}
            >
              {destinations.map((destination, index) => (
                <div key={index} className="w-80 flex-shrink-0">
                  <div className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer">
                    {/* Background image */}
                    {/* Background image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${destination.image})` }}
                    />
                    
                    {/* University logo overlay */}
                    <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-lg p-2 shadow-lg">
                      <img
                        src={imageErrors[index] ? "/logo.png" : destination.universityLogo}
                        alt={`${destination.name} University Logo`}
                        className="w-full h-full object-contain"
                        onError={() => handleImageError(index)}
                      />
                    </div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-end text-white p-6">
                      <div className="transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                        <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                        <p className="text-sm text-white/90 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                          {destination.description}
                        </p>
                        <div className="flex items-center space-x-4 text-white/80">
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="w-4 h-4" />
                            <span className="text-xs font-medium">Learn More</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4" />
                            <span className="text-xs font-medium">{destination.city}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover border */}
                    <div className="absolute inset-0 border-2 border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}