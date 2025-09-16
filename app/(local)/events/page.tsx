"use client";

import { CalendarIcon, ClockIcon, UsersIcon, VideoIcon, ArrowRightIcon, StarIcon, TrendingUpIcon, GlobeIcon, MapPinIcon } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import Link from "next/link";
import { useState, useEffect } from "react";
interface Event {
  _id: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  startAt?: string;
  endAt?: string;
  date?: string;
  time?: string;
  location?: string;
  venue?: string;
  city?: string;
  capacity?: number;
  seatsRemaining?: number;
  price?: number;
  currency?: string;
  isFree?: boolean;
  eventType?: string;
  category?: string;
  organizer?: string;
  featured?: boolean;
  priority?: string;
  status?: string;
  registrationDeadline?: string;
  locationDetails?: {
    address?: string;
    parking?: boolean;
    accessibility?: boolean;
  };
  onlineDetails?: {
    platform?: string;
    meetingLink?: string;
  };
  speakers?: Array<{
    name: string;
    title: string;
    company?: string;
  }>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

function EventCard({ event, index, isPast = false }: { event: Event; index: number; isPast?: boolean }) {

  const getEventTypeIcon = (type?: string) => {
    switch (type) {
      case 'webinar': return VideoIcon;
      case 'workshop': return UsersIcon;
      case 'seminar': return GlobeIcon;
      case 'conference': return UsersIcon;
      case 'fair': return GlobeIcon;
      case 'exhibition': return GlobeIcon;
      case 'networking': return UsersIcon;
      default: return CalendarIcon;
    }
  };

  const getEventTypeColor = (type?: string) => {
    switch (type) {
      case 'webinar': return 'bg-blue-50 text-blue-600';
      case 'workshop': return 'bg-green-50 text-green-600';
      case 'seminar': return 'bg-purple-50 text-purple-600';
      case 'conference': return 'bg-indigo-50 text-indigo-600';
      case 'fair': return 'bg-orange-50 text-orange-600';
      case 'exhibition': return 'bg-pink-50 text-pink-600';
      case 'networking': return 'bg-teal-50 text-teal-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "TBD";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "TBD";
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = () => {
    if (event.isFree) return "Free";
    if (event.price && event.currency) {
      return `${event.currency} ${event.price}`;
    }
    return "Free";
  };

  const isRegistrationOpen = () => {
    if (event.registrationDeadline) {
      return new Date(event.registrationDeadline) > new Date();
    }
    return true;
  };

  const hasAvailableSeats = () => {
    if (!event.capacity || !event.seatsRemaining) return true;
    return event.seatsRemaining > 0;
  };

  const IconComponent = getEventTypeIcon(event.eventType);
  const attendancePercentage = event.capacity && event.seatsRemaining 
    ? ((event.capacity - event.seatsRemaining) / event.capacity) * 100 
    : 0;

  return (
    <>
      <Reveal delay={index * 0.1}>
        <div className={`relative rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 ${event.featured ? 'ring-2 ring-blue-500 ring-opacity-20' : ''} ${isPast ? 'opacity-90' : ''}`}>
          {event.featured && !isPast && (
            <div className="absolute -top-3 -right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <StarIcon className="h-3 w-3" />
              Featured
            </div>
          )}
          {isPast && (
            <div className="absolute -top-3 -right-3 bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              Completed
            </div>
          )}
          
          <div className="flex items-start justify-between mb-4">
            <div className={`inline-flex rounded-xl p-2 ${getEventTypeColor(event.eventType)}`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{formatPrice()}</div>
              <div className="text-xs text-gray-500 capitalize">{event.eventType || 'event'}</div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{event.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDate(event.startAt || event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ClockIcon className="h-4 w-4" />
              <span>{formatTime(event.startAt || event.time)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4" />
              <span>{event.venue || event.location || event.city || "Online Event"}</span>
            </div>
            {event.capacity && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UsersIcon className="h-4 w-4" />
                <span>{event.capacity - (event.seatsRemaining || 0)} registered</span>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5 ml-2">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-medium text-gray-700 mb-2">Topics Covered:</div>
              <div className="flex flex-wrap gap-1">
                {event.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
                {event.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{event.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            {event.speakers && event.speakers.length > 0 && (
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">{event.speakers[0].name}</div>
                  <div className="text-xs text-gray-500">{event.speakers[0].title}</div>
                </div>
              </div>
            )}
            
            {isPast ? (
              <button 
                disabled
                className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
              >
                Event Completed
              </button>
            ) : !isRegistrationOpen() ? (
              <button 
                disabled
                className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
              >
                Registration Closed
              </button>
            ) : !hasAvailableSeats() ? (
              <button 
                disabled
                className="w-full bg-red-400 text-white py-2 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
              >
                Event Full
              </button>
            ) : (
              <Link 
                href={`/events/register/${event.slug}`}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                Register Now
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </Reveal>

    </>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events from /api/events');
      const response = await fetch('/api/events');
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Events data:', data);
        setEvents(data.events);
      } else {
        console.error('Failed to fetch events, status:', response.status);
        setError('Failed to fetch events');
      }
    } catch (err) {
      setError('Error loading events');
      console.error('Error fetching events:', err);
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
      // Parse legacy date format like "Jan 15, 2025"
      const dateStr = event.date;
      
      // Try to parse the date
      try {
        const eventDate = new Date(dateStr);
        // If the parsed date is valid and in the past
        if (!isNaN(eventDate.getTime())) {
          return eventDate < new Date();
        }
      } catch (e) {
        // If parsing fails, assume it's a future event
        console.error('Error parsing date:', e);
        return false;
      }
    }
    
    // Default to future event if no date information
    return false;
  };

  // Separate events into past and upcoming
  const pastEvents = events.filter(event => isEventPast(event));
  const upcomingEvents = events.filter(event => !isEventPast(event));
  
  // Further separate upcoming events into featured and regular
  const featuredEvents = upcomingEvents.filter(event => event.featured);
  const regularUpcomingEvents = upcomingEvents.filter(event => !event.featured);

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Events & Webinars"
          subtitle="Join our expert-led sessions to get personalized guidance on studying abroad, visa applications, and university admissions"
          image="/hero/slide2.svg"
        />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Events & Webinars"
          subtitle="Join our expert-led sessions to get personalized guidance on studying abroad, visa applications, and university admissions"
          image="/hero/slide2.svg"
        />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchEvents}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Events & Webinars"
        subtitle="Join our expert-led sessions to get personalized guidance on studying abroad, visa applications, and university admissions"
        image="/hero/slide2.svg"
      />
      
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-16">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Events</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Don&apos;t miss these highly recommended sessions designed to maximize your study abroad success.
                </p>
              </div>
            </Reveal>
            
            <div className="grid gap-8 md:grid-cols-2">
              {featuredEvents.map((event, index) => (
                <EventCard key={event._id || event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* All Upcoming Events */}
        <div className="mb-16">
          <Reveal>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Upcoming Events</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4" />
                <span>{regularUpcomingEvents.length} events scheduled</span>
              </div>
            </div>
          </Reveal>
          
          {regularUpcomingEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regularUpcomingEvents.map((event, index) => (
                <EventCard key={event._id || event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
              <p className="text-gray-600">Check back soon for new events and webinars!</p>
            </div>
          )}
        </div>

        {/* Statistics Section */}
        <Reveal delay={0.3}>
          <div className="mb-16 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Join Thousands of Successful Students</h3>
              <p className="text-green-100 max-w-2xl mx-auto">
                Our events have helped students from around the world achieve their study abroad dreams.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-green-200" />
                <div className="text-2xl font-bold mb-1">150+</div>
                <div className="text-green-200 text-sm">Events Hosted</div>
              </div>
              <div className="text-center">
                <UsersIcon className="h-8 w-8 mx-auto mb-2 text-green-200" />
                <div className="text-2xl font-bold mb-1">25k+</div>
                <div className="text-green-200 text-sm">Attendees</div>
              </div>
              <div className="text-center">
                <StarIcon className="h-8 w-8 mx-auto mb-2 text-green-200" />
                <div className="text-2xl font-bold mb-1">4.8</div>
                <div className="text-green-200 text-sm">Average Rating</div>
              </div>
              <div className="text-center">
                <TrendingUpIcon className="h-8 w-8 mx-auto mb-2 text-green-200" />
                <div className="text-2xl font-bold mb-1">95%</div>
                <div className="text-green-200 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Past Events */}
        <div className="mb-16">
          <Reveal>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Past Events</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4" />
                <span>{pastEvents.length} events completed</span>
              </div>
            </div>
          </Reveal>
          
          {pastEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event, index) => (
                <EventCard key={event._id || event.id} event={event} index={index} isPast={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No past events yet</h3>
              <p className="text-gray-600">Past events will appear here once they&apos;re completed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
