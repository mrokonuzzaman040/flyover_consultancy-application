"use client";

import { useState, useEffect } from 'react';
import ScheduleMeetingModal from "@/components/modals/ScheduleMeetingModal";
import { usePartners } from '@/hooks/use-partners';
import { Loader2, Globe, Award, Users, TrendingUp } from 'lucide-react';

export default function PartnershipsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { partners, loading, error } = usePartners();

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

  // Create partners with SVG logos from MongoDB data
  const partnersWithLogos = partners.map(partner => ({
    ...partner,
    logoSvg: (
      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${partner.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
        <span className="text-white text-xs font-bold text-center leading-tight px-2">
          {partner.logo}
        </span>
      </div>
    )
  }));

  const stats = [
    { number: "200+", label: "Partner Universities", icon: Award, color: "from-blue-500 to-blue-600" },
    { number: "50+", label: "Countries", icon: Globe, color: "from-green-500 to-green-600" },
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
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-brand-500 to-blue-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-brand-200 mb-6">
            <Globe className="w-4 h-4 text-brand-600 mr-2" />
            <span className="text-sm font-medium text-brand-700">Global University Network</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Our Prestigious <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-blue-600 to-purple-600">University Partners</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We have established partnerships with world-renowned universities across the globe, 
            opening doors to exceptional educational opportunities and ensuring your academic success.
          </p>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index}
                className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/20 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className={`text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-20">
          {partnersWithLogos.map((partner, index) => (
            <div
              key={partner._id || partner.id}
              className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:rotate-1 border border-white/30 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: `${index * 150}ms`
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${partner.color} opacity-0 group-hover:opacity-10 transition-all duration-500 rounded-3xl`} />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              
              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Logo */}
                <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  {partner.logoSvg}
                </div>
                
                {/* University Name */}
                <h3 className="text-sm font-bold text-gray-900 mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:to-purple-600 transition-all duration-500">
                  {partner.name}
                </h3>
                
                {/* Category & Country */}
                <div className="space-y-2">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${partner.color} text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
                    {partner.category}
                  </div>
                  <div className="text-xs text-gray-500 font-medium flex items-center justify-center">
                    <Globe className="w-3 h-3 mr-1" />
                    {partner.country}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                {hoveredIndex === index && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${partner.color} opacity-20 rounded-3xl animate-pulse blur-sm`} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Bottom CTA */}
        <div className="text-center">
          <div className="relative bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/30 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-500 to-purple-500 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-green-500 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
                <Award className="w-4 h-4 mr-2" />
                Premium University Access
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Ready to Join a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-purple-600 to-blue-600">World-Class University?</span>
              </h3>
              
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Our exclusive partnerships ensure you get direct access to top universities with streamlined application processes, 
                scholarship opportunities, and personalized guidance every step of the way.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="group px-10 py-4 bg-gradient-to-r from-brand-600 via-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:from-brand-700 hover:via-purple-700 hover:to-blue-700 transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                  <span className="flex items-center justify-center">
                    <Globe className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Explore Universities
                  </span>
                </button>
                <button 
                  onClick={handleScheduleClick}
                  className="group px-10 py-4 bg-white border-2 border-brand-600 text-brand-600 rounded-2xl font-bold hover:bg-brand-600 hover:text-white transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center">
                    <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Schedule Consultation
                  </span>
                </button>
              </div>
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