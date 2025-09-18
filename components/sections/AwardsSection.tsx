"use client";

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Award, Star, Trophy, Medal, Shield, Zap, Users, Lightbulb, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAwards } from '@/hooks/use-awards';
import Image from 'next/image';

export default function AwardsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { awards, loading, error } = useAwards();

  // Calculate how many awards to show per slide based on screen size
  const awardsPerSlide = 4;
  const totalSlides = Math.ceil(awards.length / awardsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (totalSlides <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [totalSlides]);

  // Icon mapping for awards
  const iconMap = {
    Award,
    Star,
    Trophy,
    Medal,
    Shield,
    Zap,
    Users,
    Lightbulb
  };

  // Loading state
  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            <span className="ml-2 text-gray-600">Loading awards...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error loading awards: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  // No awards state
  if (awards.length === 0) {
    return (
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">No awards available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-48 h-48 bg-brand-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-3 py-1.5 bg-brand-50 rounded-full text-black text-sm font-semibold mb-4">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Recognized Excellence
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
            Awards & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-500">Achievements</span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
             Our commitment to excellence has earned recognition from prestigious organizations worldwide.
           </p>
        </div>

        {/* Awards Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl border border-gray-200/50 flex items-center justify-center text-gray-600 hover:text-brand-600 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl border border-gray-200/50 flex items-center justify-center text-gray-600 hover:text-brand-600 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Awards Container */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 px-2">
                    {awards
                      .slice(slideIndex * awardsPerSlide, (slideIndex + 1) * awardsPerSlide)
                      .map((award, index) => {
                        // Assign a random icon for visual variety
                        const iconKeys = Object.keys(iconMap) as (keyof typeof iconMap)[];
                        const randomIcon = iconKeys[(slideIndex * awardsPerSlide + index) % iconKeys.length];
                        
                        return (
                          <div
                            key={award._id || award.id}
                            className={`group relative bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200/50 overflow-hidden ${
                              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                            style={{
                              transitionDelay: `${index * 100}ms`
                            }}
                            onMouseEnter={() => setHoveredIndex(slideIndex * awardsPerSlide + index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                          >
                            {/* Background Pattern & Glow */}
                            <div className="absolute inset-0 opacity-5">
                              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full blur-lg transition-opacity duration-300 ${hoveredIndex === slideIndex * awardsPerSlide + index ? 'opacity-15' : 'opacity-5'}`}></div>
                            </div>
                            
                            {/* Hover Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br from-brand-500/5 to-brand-600/5 rounded-xl transition-opacity duration-300 ${hoveredIndex === slideIndex * awardsPerSlide + index ? 'opacity-100' : 'opacity-0'}`}></div>

                            {/* Award Image/Icon */}
                            <div className="relative mb-3 flex items-center justify-between">
                              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-all duration-300 shadow-md overflow-hidden">
                                {award.image ? (
                                  <Image
                                    src={award.image}
                                    alt={award.title}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Fallback to icon if image fails
                                      e.currentTarget.style.display = 'none';
                                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (fallback) fallback.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div 
                                  className="w-full h-full flex items-center justify-center"
                                  style={{ display: award.image ? 'none' : 'flex' }}
                                >
                                  {React.createElement(iconMap[randomIcon], { className: "w-6 h-6" })}
                                </div>
                              </div>
                              {/* Year badge */}
                              <span className="px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-brand shadow-sm">
                                {award.year}
                              </span>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                              <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-all duration-300 leading-tight">
                                {award.title}
                              </h3>
                              
                              {/* Award Age */}
                              <div className="flex items-center justify-between pt-2 border-t border-gray-200/70">
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500">
                                    {award.year === new Date().getFullYear() ? 'Recent' : `${new Date().getFullYear() - award.year}y ago`}
                                  </p>
                                </div>
                                
                                {/* Status indicator */}
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 ${hoveredIndex === slideIndex * awardsPerSlide + index ? 'animate-pulse' : ''}`}></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? 'bg-brand-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}