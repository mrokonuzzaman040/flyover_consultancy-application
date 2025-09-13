"use client";

import { useState, useEffect, useRef } from 'react';

export default function AwardsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const awards = [
    {
      title: "Best Education Consultancy 2023",
      description: "Recognized as the leading education consultancy for outstanding student placement services",
      year: "2023",
      organization: "Global Education Awards",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: "from-yellow-400 to-orange-500"
    },
    {
      title: "Excellence in Student Support",
      description: "Awarded for exceptional dedication to student welfare and comprehensive support services",
      year: "2023",
      organization: "International Education Council",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: "from-blue-400 to-indigo-500"
    },
    {
      title: "Top Visa Success Rate",
      description: "Achieved highest visa approval rate among education consultancies in the region",
      year: "2022",
      organization: "Visa Success Institute",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "from-green-400 to-emerald-500"
    },
    {
      title: "Innovation in Education",
      description: "Recognized for innovative approaches to international education consulting",
      year: "2022",
      organization: "Education Innovation Awards",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "from-purple-400 to-pink-500"
    }
  ];

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
          {awards.map((award, index) => (
            <div
              key={index}
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
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${award.color} rounded-full blur-xl transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-15' : 'opacity-5'}`}></div>
              </div>
              
              {/* Hover Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br from-brand-500/5 to-brand-600/5 rounded-2xl transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}></div>

              {/* Award Icon */}
              <div className="relative mb-6 flex items-center justify-between">
                <div className={`w-16 h-16 bg-gradient-to-br from-brand to-brand-300 rounded-2xl flex items-center justify-center text-white group-hover:scale-105 transition-all duration-300 shadow-lg`}>
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    {award.icon}
                  </div>
                </div>
                {/* Year badge */}
                <span className={`px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-brand shadow-sm`}>
                  {award.year}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-all duration-300 leading-tight">
                  {award.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  {award.description}
                </p>
                
                {/* Organization */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/70">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">
                      {award.organization}
                    </p>
                  </div>
                  
                  {/* Status indicator */}
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${award.color} ${hoveredIndex === index ? 'animate-pulse' : ''}`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}