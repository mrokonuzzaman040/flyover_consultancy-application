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
    <section ref={sectionRef} className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-brand-50 rounded-full text-black text-sm font-semibold mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Recognized Excellence
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Awards & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-500">Achievements</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
             Our unwavering commitment to excellence has earned recognition from prestigious organizations worldwide, 
             validating our dedication to transforming students&apos; educational journeys.
           </p>
        </div>

        {/* Awards Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-20">
          {awards.map((award, index) => (
            <div
              key={index}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 border border-gray-200/50 overflow-hidden ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              }`}
              style={{
                transitionDelay: `${index * 150}ms`
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background Pattern & Glow */}
              <div className="absolute inset-0 opacity-5">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${award.color} rounded-full blur-2xl transition-opacity duration-500 ${hoveredIndex === index ? 'opacity-20' : 'opacity-5'}`}></div>
                <svg viewBox="0 0 100 100" className="absolute top-0 right-0 w-32 h-32">
                  <defs>
                    <pattern id={`pattern-${index}`} x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill={`url(#pattern-${index})`} />
                </svg>
              </div>
              
              {/* Hover Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br from-brand-500/5 to-brand-600/5 rounded-3xl transition-opacity duration-500 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}></div>

              {/* Award Icon */}
              <div className="relative mb-8">
                <div className={`w-20 h-20 bg-gradient-to-br from-brand to-red-300 rounded-3xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl group-hover:shadow-2xl`}>
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    {award.icon}
                  </div>
                </div>
                {/* Floating badge with pulse animation */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-brand to-yellow-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                {/* Glow effect */}
                <div className={`absolute inset-0 w-20 h-20 bg-gradient-to-br from-brand-400 to-brand-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-brand shadow-lg`}>
                    {award.year}
                  </span>
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${award.color} animate-pulse`}></div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand-600 transition-all duration-300 leading-tight">
                  {award.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed text-base">
                  {award.description}
                </p>
                
                {/* Organization */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200/70">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 uppercase tracking-wider font-bold mb-1">
                      Awarded by
                    </p>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">
                      {award.organization}
                    </p>
                  </div>
                  
                  {/* Enhanced hover indicator */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                    hoveredIndex === index 
                      ? `bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-xl scale-110 rotate-12` 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}>
                    <svg className={`w-5 h-5 transition-transform duration-300 ${hoveredIndex === index ? 'translate-x-0.5' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}