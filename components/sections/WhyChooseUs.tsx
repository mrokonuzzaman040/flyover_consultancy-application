"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { Shield, Users, Globe, Award, Clock, HeartHandshake, BookOpen, CheckCircle } from 'lucide-react';
import sectionsData from '@/data/sections-data.json';

interface WhyChooseUsProps {
  features?: typeof sectionsData.whyChooseUsFeatures;
}

export default function WhyChooseUs({ features = sectionsData.whyChooseUsFeatures }: WhyChooseUsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Icon mapping for features
  const iconMap = {
    Shield,
    Users,
    Globe,
    Award,
    Clock,
    HeartHandshake,
    BookOpen,
    CheckCircle
  };

  // Remove hardcoded features array - now using props

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-brand-600">Flyover Global</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in achieving international education dreams with proven expertise
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-brand-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon */}
              <div className="relative mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                  {React.createElement(iconMap[feature.icon as keyof typeof iconMap], { className: "w-8 h-8" })}
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  {feature.description}
                </p>
                
                {/* Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-xl font-bold text-brand-600">{feature.stat}</div>
                    <div className="text-xs text-gray-500">{feature.statLabel}</div>
                  </div>
                  <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center group-hover:bg-brand-200 transition-colors duration-300">
                    <svg className="w-3 h-3 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-full font-semibold hover:from-brand-700 hover:to-brand-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <span>Start Your Journey Today</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}