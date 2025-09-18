"use client";

import { useState, useEffect } from 'react';
import ScheduleMeetingModal from "@/components/modals/ScheduleMeetingModal";
import { usePartners } from '@/hooks/use-partners';
import { Loader2, Globe, Award, Users, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function PartnershipsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { partners, loading, error } = usePartners();

  // Slider configuration
  const partnersPerSlide = 6; // Show 6 partners per slide for larger cards
  const totalSlides = Math.ceil(partners.length / partnersPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleScheduleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [totalSlides]);

  // Create partners with proper logos from MongoDB data
  const partnersWithLogos = partners.map(partner => ({
    ...partner,
    logoComponent: (
      <div className="w-20 h-20 rounded-2xl bg-white shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center p-2 border border-gray-100">
        {partner.logo && (partner.logo.startsWith('http') || partner.logo.startsWith('/')) ? (
          <Image
            src={partner.logo}
            alt={partner.name}
            width={76}
            height={76}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to colored circle with initials
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.parentElement?.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className="w-full h-full rounded-xl flex items-center justify-center"
          style={{ 
            backgroundColor: partner.color || '#1F4E79',
            display: partner.logo && (partner.logo.startsWith('http') || partner.logo.startsWith('/')) ? 'none' : 'flex'
          }}
        >
          <span className="text-white text-sm font-bold text-center leading-tight">
            {partner.name.split(' ').map(word => word[0]).join('').substring(0, 3)}
          </span>
        </div>
      </div>
    )
  }));

  // Calculate dynamic stats from partners data
  const uniqueCountries = [...new Set(partners.map(p => p.country))];
  const uniqueCategories = [...new Set(partners.map(p => p.category))];
  
  const stats = [
    { number: `${partners.length}`, label: "Total Partners", icon: Award, color: "from-blue-500 to-blue-600" },
    { number: `${uniqueCountries.length}`, label: "Countries", icon: Globe, color: "from-green-500 to-green-600" },
    { number: "15+", label: "Years Experience", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
    { number: "98%", label: "Success Rate", icon: Users, color: "from-orange-500 to-orange-600" }
  ];

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            <span className="ml-2 text-gray-600">Loading our university partners...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error loading partners: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-brand-500 to-blue-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-brand-200 mb-4">
            <Globe className="w-4 h-4 text-brand-600 mr-2" />
            <span className="text-sm font-medium text-brand-700">Trusted by {partners.length}+ Partners</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-blue-600 to-purple-600">Global Partners</span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connecting students with world-renowned institutions across {uniqueCountries.length} countries.
          </p>
        </div>

        {/* Compact Stats Row */}
        <div className="flex justify-center items-center gap-8 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-1`}>
                  {stat.number}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Partners Slider */}
        <div className="relative min-h-[200px]">
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 flex items-center justify-center text-gray-600 hover:text-brand-600 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 flex items-center justify-center text-gray-600 hover:text-brand-600 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Partners Container */}
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 px-4">
                    {partners
                      .slice(slideIndex * partnersPerSlide, (slideIndex + 1) * partnersPerSlide)
                      .map((partner, index) => (
                        <div
                          key={partner._id || partner.id}
                          className={`group relative bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-white/30 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                          }`}
                          style={{
                            transitionDelay: `${index * 50}ms`
                          }}
                          onMouseEnter={() => setHoveredIndex(slideIndex * partnersPerSlide + index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          {/* Partner Logo */}
                          <div className="flex justify-center mb-3">
                            <div className="w-16 h-16 rounded-lg bg-white shadow-sm flex items-center justify-center p-2 border border-gray-100">
                              {partner.logo && (partner.logo.startsWith('http') || partner.logo.startsWith('/')) ? (
                                <Image
                                  src={partner.logo}
                                  alt={partner.name}
                                  width={56}
                                  height={56}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.parentElement?.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                className="w-full h-full rounded-lg flex items-center justify-center"
                                style={{ 
                                  backgroundColor: partner.color || '#1F4E79',
                                  display: partner.logo && (partner.logo.startsWith('http') || partner.logo.startsWith('/')) ? 'none' : 'flex'
                                }}
                              >
                                <span className="text-white text-sm font-bold">
                                  {partner.name.split(' ').map(word => word[0]).join('').substring(0, 2)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Partner Name */}
                          <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-2 min-h-[2.5rem] flex items-center justify-center">
                            <span className="text-center" style={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {partner.name}
                            </span>
                          </h3>
                          
                          {/* Category & Country */}
                          <div className="space-y-1">
                            <div className="flex justify-center">
                              <div 
                                className="px-2 py-1 rounded-full text-xs font-medium text-white text-center"
                                style={{ backgroundColor: partner.color || '#1F4E79' }}
                                title={partner.category}
                              >
                                <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                  {partner.category}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 font-normal text-center" title={partner.country}>
                              <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                {partner.country}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-4 gap-1">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? 'bg-brand-600 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Compact CTA */}
        <div className="text-center mt-8">
          <div className="inline-flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-6 py-2 bg-gradient-to-r from-brand-600 to-blue-600 text-white rounded-lg font-semibold hover:from-brand-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              <span className="flex items-center justify-center">
                <Globe className="w-4 h-4 mr-2" />
                Explore Universities
              </span>
            </button>
            <button 
              onClick={handleScheduleClick}
              className="group px-6 py-2 bg-white border border-brand-600 text-brand-600 rounded-lg font-semibold hover:bg-brand-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="flex items-center justify-center">
                <Users className="w-4 h-4 mr-2" />
                Schedule Consultation
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <ScheduleMeetingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}