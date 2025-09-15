"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import StarRating from "@/components/ui/star-rating";
import sectionsData from '@/data/sections-data.json';

interface SuccessStoriesProps {
  successStories?: typeof sectionsData.successStories;
}

export default function SuccessStories({ successStories = sectionsData.successStories }: SuccessStoriesProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [itemsPerSlide, setItemsPerSlide] = useState(3); // Default to desktop view

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const getItemsPerSlide = () => {
      if (window.innerWidth < 768) return 1; // mobile
      if (window.innerWidth < 1024) return 2; // tablet
      return 3; // desktop
    };

    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
    };

    // Set initial value
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(successStories.length / itemsPerSlide);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 8000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  // const getCurrentStories = () => {
  //   const startIndex = currentSlide * 3;
  //   return successStories.slice(startIndex, startIndex + 3);
  // };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const stats = [
    { number: "22,000+", label: "Success Stories" },
    { number: "95%", label: "Visa Success Rate" },
    { number: "$50M+", label: "Scholarships Secured" },
    { number: "200+", label: "Partner Universities" }
  ];

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 px-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-700">22,000+</span> Success Stories
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8 px-4">
            Real students, real achievements. Discover how Flyover Global has transformed dreams into reality for thousands of students worldwide.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto px-4">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center transform transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-700 mb-1">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stories Slider */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className={`grid gap-6 md:gap-8 px-4 ${
                    itemsPerSlide === 1 ? 'grid-cols-1' : 
                    itemsPerSlide === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {successStories.slice(slideIndex * itemsPerSlide, slideIndex * itemsPerSlide + itemsPerSlide).map((story, index) => (
                      <div
                        key={story.id}
                        className={`group relative bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                        style={{
                          transitionDelay: `${index * 150}ms`
                        }}
                        onMouseEnter={() => setHoveredIndex(slideIndex * itemsPerSlide + index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                        
                        {/* Content */}
                        <div className="relative z-10">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4 md:mb-6">
                            <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                              <div className="flex-shrink-0">
                                <div className={`w-16 h-16 bg-gradient-to-br ${story.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                                  {story.avatar}
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:to-brand-700 transition-all duration-300 text-sm md:text-base truncate">
                                  {story.author}
                                </h3>
                                <div className="text-xs md:text-sm text-gray-500">
                                  Class of {story.year}
                                </div>
                              </div>
                            </div>
                            <div className="text-xl md:text-2xl flex-shrink-0 ml-2">{story.flag}</div>
                          </div>

                          {/* University Info */}
                          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-xl group-hover:bg-gradient-to-r group-hover:from-brand-50 group-hover:to-brand-50 transition-all duration-300">
                            <div className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{story.university}</div>
                            <div className="text-xs md:text-sm text-gray-600 mb-2">{story.program}</div>
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                {story.scholarship}
                              </span>
                              <span className="text-xs text-gray-500">{story.country}</span>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="mb-3 md:mb-4">
                            <StarRating value={story.rating} />
                          </div>

                          {/* Testimonial */}
                          <blockquote className="text-gray-700 leading-relaxed mb-4 md:mb-6 italic text-sm md:text-base">
                            &ldquo;{story.text}&rdquo;
                          </blockquote>

                          {/* Hover Effect */}
                          {hoveredIndex === slideIndex * itemsPerSlide + index && (
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-brand-600/10 rounded-2xl animate-pulse" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 md:mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-gradient-to-r from-brand-600 to-brand-700 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 mx-4">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-sm md:text-base px-4">
              Join thousands of successful students who have achieved their dreams with Flyover Global. Your journey to a world-class education starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-consultation" className="px-6 md:px-8 py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-full font-semibold hover:from-brand-700 hover:to-brand-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base">
                Start Your Journey
              </Link>
              <button className="px-6 md:px-8 py-3 border-2 border-brand-600 text-brand-600 rounded-full font-semibold hover:bg-brand-600 hover:text-white transition-all duration-300 text-sm md:text-base">
                Read More Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}