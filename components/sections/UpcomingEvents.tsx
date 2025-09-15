"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import sectionsData from '@/data/sections-data.json';

interface UpcomingEventsProps {
  events?: typeof sectionsData.upcomingEvents;
}

export default function UpcomingEvents({ events = sectionsData.upcomingEvents }: UpcomingEventsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // Remove hardcoded events array - now using props

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return { day, month };
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-300">Events</span>
            </h2>
            <p className="text-xl text-gray-600">
              Join our events to accelerate your study abroad journey
            </p>
          </div>
          <Link 
            href="/events" 
            className="group inline-flex items-center px-6 py-3 bg-brand text-white rounded-full font-semibold hover:from-brand-600 hover:to-brand-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>View All Events</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => {
            const { day, month } = formatDate(event.date);
            return (
              <article
                key={index}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${
                  event.featured ? 'ring-2 ring-brand-500 ring-opacity-50' : ''
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Featured Badge */}
                {event.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      Featured
                    </div>
                  </div>
                )}

                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="p-8">
                  {/* Date Card */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${event.color} rounded-xl flex flex-col items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-xs font-semibold uppercase">{month}</div>
                      <div className="text-lg font-bold">{day}</div>
                    </div>
                    
                    {/* Event Type Badge */}
                    <div className={`px-3 py-1 bg-gradient-to-r ${event.color} text-white rounded-full text-xs font-semibold`}>
                      {event.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {event.attendees} attendees
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <button className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                        hoveredIndex === index
                          ? `bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg transform scale-105`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                        {event.type === 'Webinar' ? 'Register Free' : 'Register Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}