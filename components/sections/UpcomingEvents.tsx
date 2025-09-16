"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';

interface Event {
  _id?: string;
  id?: string | number;
  title: string;
  slug: string;
  description: string;
  date?: string;
  time?: string;
  location?: string;
  type?: string;
  attendees?: string;
  featured?: boolean;
  icon?: string;
  color?: string;
  startAt?: string;
  endAt?: string;
  eventType?: string;
  category?: string;
  targetAudience?: string;
  organizer?: string;
  organizerEmail?: string;
  organizerPhone?: string;
  price?: number;
  currency?: string;
  isFree?: boolean;
  registrationDeadline?: string;
  maxAttendees?: number;
  minAttendees?: number;
  capacity?: number;
  seatsRemaining?: number;
  requirements?: string[];
  agenda?: string[];
  speakers?: Array<{
    name: string;
    title: string;
    bio?: string;
    image?: string;
    company?: string;
  }>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface UpcomingEventsProps {
  events?: Event[];
}

export default function UpcomingEvents({ events: propEvents }: UpcomingEventsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (propEvents) {
      setEvents(propEvents);
      setLoading(false);
    } else {
      fetchEvents();
    }
  }, [propEvents]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      } else {
        console.error('Failed to fetch events for UpcomingEvents section');
      }
    } catch (err) {
      console.error('Error fetching events for UpcomingEvents section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if an event is in the past
  const isEventPast = (event: Event) => {
    // If event has startAt (new format)
    if (event.startAt) {
      return new Date(event.startAt) < new Date();
    }
    
    // If event has date (legacy format)
    if (event.date) {
      try {
        const eventDate = new Date(event.date);
        return !isNaN(eventDate.getTime()) && eventDate < new Date();
      } catch (e) {
        return false; // Assume future if parsing fails
      }
    }
    
    return false; // Default to future event
  };

  // Filter to show only upcoming events (max 3 for homepage)
  const upcomingEvents = events
    .filter(event => !isEventPast(event))
    .slice(0, 3);

  const formatDate = (event: Event) => {
    // Try startAt first (new format)
    if (event.startAt) {
      const date = new Date(event.startAt);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      return { day, month };
    }
    
    // Fallback to legacy date format
    if (event.date) {
      try {
        const date = new Date(event.date);
        if (!isNaN(date.getTime())) {
          const day = date.getDate();
          const month = date.toLocaleDateString('en-US', { month: 'short' });
          return { day, month };
        }
      } catch (e) {
        // If parsing fails, return default values
      }
    }
    
    // Default fallback
    return { day: 'TBD', month: 'TBD' };
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
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                    <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="pt-4">
                      <div className="h-12 bg-gray-200 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event, index) => {
              const { day, month } = formatDate(event);
              const eventType = event.eventType || event.type || 'Event';
              const eventColor = event.color || 'from-blue-500 to-indigo-600';
              const eventTime = event.time || 'TBD';
              const eventLocation = event.location || 'TBD';
              const eventAttendees = event.attendees || 'TBD';
              
              return (
                <article
                  key={event._id || event.id || index}
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
                  <div className={`absolute inset-0 bg-gradient-to-br ${eventColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  <div className="p-8">
                    {/* Date Card */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${eventColor} rounded-xl flex flex-col items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-xs font-semibold uppercase">{month}</div>
                        <div className="text-lg font-bold">{day}</div>
                      </div>
                      
                      {/* Event Type Badge */}
                      <div className={`px-3 py-1 bg-gradient-to-r ${eventColor} text-white rounded-full text-xs font-semibold`}>
                        {eventType}
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
                          {eventTime}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {eventLocation}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {eventAttendees} attendees
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4">
                        <Link 
                          href={`/events/register/${event.slug}`}
                          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 block text-center ${
                            hoveredIndex === index
                              ? `bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg transform scale-105`
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {eventType === 'Webinar' ? 'Register Free' : 'Register Now'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
            <p className="text-gray-600">Check back soon for new events and webinars!</p>
          </div>
        )}
      </div>
    </section>
  );
}