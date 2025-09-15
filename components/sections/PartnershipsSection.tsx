"use client";

import { useState, useEffect } from 'react';
import ScheduleMeetingModal from "@/components/modals/ScheduleMeetingModal";
import sectionsData from '@/data/sections-data.json';

interface PartnershipsSectionProps {
  partners?: typeof sectionsData.partners;
}

export default function PartnershipsSection({ partners = sectionsData.partners }: PartnershipsSectionProps) {
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

  // Create partners with SVG logos from props data
  const partnersWithLogos = partners.map(partner => ({
    ...partner,
    logoSvg: (
      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center`}>
        <span className="text-white text-xs font-bold text-center leading-tight">
          {partner.logo}
        </span>
      </div>
    )
  }));

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
          {partnersWithLogos.map((partner, index) => (
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
                  {partner.logoSvg}
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