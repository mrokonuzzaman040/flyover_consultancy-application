"use client";

import { useState, useEffect } from 'react';
import ScheduleMeetingModal from "@/components/modals/ScheduleMeetingModal";

export default function PartnershipsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const partners = [
    {
      id: 1,
      name: "Harvard University",
      category: "Ivy League",
      country: "USA",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="20" fill="#A41E22"/>
          <text x="50" y="35" textAnchor="middle" className="fill-white text-xs font-bold">HARVARD</text>
          <text x="50" y="65" textAnchor="middle" className="fill-white text-xs">UNIVERSITY</text>
        </svg>
      ),
      color: "from-brand-600 to-brand-800"
    },
    {
      id: 2,
      name: "University of Oxford",
      category: "Russell Group",
      country: "UK",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="20" fill="#002147"/>
          <text x="50" y="35" textAnchor="middle" className="fill-white text-xs font-bold">OXFORD</text>
          <text x="50" y="65" textAnchor="middle" className="fill-white text-xs">UNIVERSITY</text>
        </svg>
      ),
      color: "from-blue-900 to-indigo-900"
    },
    {
      id: 3,
      name: "University of Toronto",
      category: "U15 Group",
      country: "Canada",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="20" fill="#003A79"/>
          <text x="50" y="35" textAnchor="middle" className="fill-white text-xs font-bold">TORONTO</text>
          <text x="50" y="65" textAnchor="middle" className="fill-white text-xs">UNIVERSITY</text>
        </svg>
      ),
      color: "from-blue-700 to-blue-900"
    },
    {
      id: 4,
      name: "University of Melbourne",
      category: "Group of Eight",
      country: "Australia",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="20" fill="#012A5E"/>
          <text x="50" y="30" textAnchor="middle" className="fill-white text-xs font-bold">MELBOURNE</text>
          <text x="50" y="70" textAnchor="middle" className="fill-white text-xs">UNIVERSITY</text>
        </svg>
      ),
      color: "from-indigo-700 to-indigo-900"
    },
    {
      id: 5,
      name: "National University of Singapore",
      category: "ASEAN Universities",
      country: "Singapore",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="20" fill="#003D7A"/>
          <text x="50" y="40" textAnchor="middle" className="fill-white text-xs font-bold">NUS</text>
          <text x="50" y="60" textAnchor="middle" className="fill-white text-xs">Singapore</text>
        </svg>
      ),
      color: "from-blue-800 to-blue-900"
    },
    {
      id: 6,
      name: "University of British Columbia",
      category: "U15 Group",
      country: "Canada",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="20" fill="#2F5D7C"/>
          <text x="50" y="40" textAnchor="middle" className="fill-white text-xs font-bold">UBC</text>
          <text x="50" y="60" textAnchor="middle" className="fill-white text-xs">Canada</text>
        </svg>
      ),
      color: "from-slate-600 to-slate-800"
    },
    {
      id: 7,
      name: "King's College London",
      category: "Russell Group",
      country: "UK",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="20" fill="#8B1538"/>
          <text x="50" y="35" textAnchor="middle" className="fill-white text-xs font-bold">KING&apos;S</text>
          <text x="50" y="65" textAnchor="middle" className="fill-white text-xs">LONDON</text>
        </svg>
      ),
      color: "from-rose-700 to-rose-900"
    },
    {
      id: 8,
      name: "University of Sydney",
      category: "Group of Eight",
      country: "Australia",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="20" fill="#E27D00"/>
          <text x="50" y="35" textAnchor="middle" className="fill-white text-xs font-bold">SYDNEY</text>
          <text x="50" y="65" textAnchor="middle" className="fill-white text-xs">UNIVERSITY</text>
        </svg>
      ),
      color: "from-orange-600 to-orange-800"
    },
    {
      id: 9,
      name: "McGill University",
      category: "U15 Group",
      country: "Canada",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="20" fill="#ED1B2F"/>
          <text x="50" y="40" textAnchor="middle" className="fill-white text-xs font-bold">McGILL</text>
          <text x="50" y="60" textAnchor="middle" className="fill-white text-xs">UNIVERSITY</text>
        </svg>
      ),
      color: "from-brand-600 to-brand-800"
    },
    {
      id: 10,
      name: "University of Auckland",
      category: "Go8 Partner",
      country: "New Zealand",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="20" fill="#00467F"/>
          <text x="50" y="30" textAnchor="middle" className="fill-white text-xs font-bold">AUCKLAND</text>
          <text x="50" y="70" textAnchor="middle" className="fill-white text-xs">UNIVERSITY</text>
        </svg>
      ),
      color: "from-blue-700 to-blue-900"
    },
    {
      id: 11,
      name: "Imperial College London",
      category: "Russell Group",
      country: "UK",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="20" fill="#003E74"/>
          <text x="50" y="30" textAnchor="middle" className="fill-white text-xs font-bold">IMPERIAL</text>
          <text x="50" y="70" textAnchor="middle" className="fill-white text-xs">LONDON</text>
        </svg>
      ),
      color: "from-blue-800 to-blue-900"
    },
    {
      id: 12,
      name: "University of Edinburgh",
      category: "Russell Group",
      country: "UK",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="20" fill="#041E42"/>
          <text x="50" y="30" textAnchor="middle" className="fill-white text-xs font-bold">EDINBURGH</text>
          <text x="50" y="70" textAnchor="middle" className="fill-white text-xs">UNIVERSITY</text>
        </svg>
      ),
      color: "from-slate-800 to-slate-900"
    }
  ];

  const stats = [
    { number: "200+", label: "Partner Universities" },
    { number: "50+", label: "Countries" },
    { number: "15+", label: "Years Experience" },
    { number: "98%", label: "Success Rate" }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-700">University Partners</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We have established partnerships with world-renowned universities across the globe to provide you with the best educational opportunities.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`text-center transform transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-700 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-16">
          {partners.map((partner, index) => (
            <div
              key={partner.id}
              className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${partner.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
              
              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Logo */}
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {partner.logo}
                </div>
                
                {/* University Name */}
                <h3 className="text-sm font-bold text-gray-900 mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:to-brand-700 transition-all duration-300">
                  {partner.name}
                </h3>
                
                {/* Category & Country */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 font-medium">
                    {partner.category}
                  </div>
                  <div className="text-xs text-gray-400">
                    {partner.country}
                  </div>
                </div>

                {/* Hover Effect */}
                {hoveredIndex === index && (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-brand-600/10 rounded-2xl animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Join a World-Class University?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our partnerships ensure you get direct access to top universities with streamlined application processes and exclusive opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-full font-semibold hover:from-brand-700 hover:to-brand-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Explore Universities
              </button>
              <button 
                onClick={handleScheduleClick}
                className="px-8 py-3 border-2 border-brand-600 text-brand-600 rounded-full font-semibold hover:bg-brand-600 hover:text-white transition-all duration-300"
              >
                Schedule Consultation
              </button>
            </div>
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