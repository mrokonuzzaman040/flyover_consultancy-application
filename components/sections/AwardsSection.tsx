"use client";

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Award, Star, Trophy, Medal, Shield, Zap, Users, Lightbulb, Loader2 } from 'lucide-react';
import { useAwards } from '@/hooks/use-awards';
import Image from 'next/image';

export default function AwardsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { awards, loading, error } = useAwards();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

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
    <section ref={sectionRef} className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-48 h-48 bg-brand-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1.5 bg-brand-50 rounded-full text-black text-sm font-semibold mb-4">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Recognized Excellence
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Awards & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-500">Achievements</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
             Our commitment to excellence has earned recognition from prestigious organizations worldwide.
           </p>
        </div>

        {/* Awards Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {awards.map((award, index) => {
            // Assign a random icon for visual variety
            const iconKeys = Object.keys(iconMap) as (keyof typeof iconMap)[];
            const randomIcon = iconKeys[index % iconKeys.length];
            
            return (
              <div
                key={award._id || award.id}
                className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-102 border border-gray-200/50 overflow-hidden ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Background Pattern & Glow */}
                <div className="absolute inset-0 opacity-5">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full blur-xl transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-15' : 'opacity-5'}`}></div>
                </div>
                
                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-brand-500/5 to-brand-600/5 rounded-2xl transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}></div>

                {/* Award Image/Icon */}
                <div className="relative mb-6 flex items-center justify-between">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden">
                    {award.image ? (
                      <Image
                        src={award.image}
                        alt={award.title}
                        width={64}
                        height={64}
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
                      {React.createElement(iconMap[randomIcon], { className: "w-8 h-8" })}
                    </div>
                  </div>
                  {/* Year badge */}
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-brand shadow-sm">
                    {award.year}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-all duration-300 leading-tight">
                    {award.title}
                  </h3>
                  
                  {/* Award Age */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/70">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">
                        {award.year === new Date().getFullYear() ? 'Recent Award' : `${new Date().getFullYear() - award.year} years ago`}
                      </p>
                    </div>
                    
                    {/* Status indicator */}
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 ${hoveredIndex === index ? 'animate-pulse' : ''}`}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}