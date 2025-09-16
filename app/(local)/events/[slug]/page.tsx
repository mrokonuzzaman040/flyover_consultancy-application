"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CalendarIcon, ClockIcon, UsersIcon, MapPinIcon, DollarSignIcon, ArrowLeftIcon, StarIcon, GlobeIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import EventRegistrationModal from "@/components/modals/EventRegistrationModal";

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
  organizerEmail?: string;
  organizerPhone?: string;
  featured?: boolean;
  priority?: string;
  status?: string;
  registrationDeadline?: string;
  locationDetails?: {
    address?: string;
    coordinates?: { lat: number; lng: number };
    parking?: boolean;
    accessibility?: boolean;
    directions?: string;
  };
  onlineDetails?: {
    platform?: string;
    meetingLink?: string;
    meetingId?: string;
    password?: string;
    instructions?: string;
  };
  speakers?: Array<{
    name: string;
    title: string;
    company?: string;
    bio?: string;
    image?: string;
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      website?: string;
    };
  }>;
  agenda?: Array<{
    time: string;
    title: string;
    description?: string;
    speaker?: string;
  }>;
  tags?: string[];
  materials?: Array<{
    title: string;
    type: string;
    url: string;
    description?: string;
  }>;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data.event);
      } else if (response.status === 404) {
        setError('Event not found');
      } else {
        setError('Failed to fetch event');
      }
    } catch (err) {
      setError('Error loading event');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
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
    if (!event) return "Free";
    if (event.isFree) return "Free";
    if (event.price && event.currency) {
      return `${event.currency} ${event.price}`;
    }
    return "Free";
  };

  const isRegistrationOpen = () => {
    if (!event) return false;
    if (event.registrationDeadline) {
      return new Date(event.registrationDeadline) > new Date();
    }
    return true;
  };

  const hasAvailableSeats = () => {
    if (!event) return false;
    if (!event.capacity || !event.seatsRemaining) return true;
    return event.seatsRemaining > 0;
  };

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

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Loading Event..."
          subtitle="Please wait while we load the event details"
          image="/hero/slide2.svg"
        />
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div>
        <PageHeader
          title="Event Not Found"
          subtitle="The event you're looking for doesn't exist or has been removed"
          image="/hero/slide2.svg"
        />
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Event not found'}</p>
            <Link href="/events" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = getEventTypeIcon(event.eventType);

  return (
    <div>
      <PageHeader
        title={event.title}
        subtitle={event.description}
        image="/hero/slide2.svg"
      />
      
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Reveal>
          <Link href="/events" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Events
          </Link>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <Reveal>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                        {event.eventType || 'Event'}
                      </span>
                      {event.featured && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-medium rounded-full flex items-center gap-1">
                          <StarIcon className="h-3 w-3" />
                          Featured
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                    <p className="text-gray-600 text-lg leading-relaxed">{event.description}</p>
                  </div>
                </div>

                {/* Event Info Grid */}
                <div className="grid gap-4 md:grid-cols-2 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-500">Date</div>
                      <div className="font-medium text-gray-900">{formatDate(event.startAt || event.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-500">Time</div>
                      <div className="font-medium text-gray-900">{formatTime(event.startAt || event.time)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPinIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-medium text-gray-900">
                        {event.venue || event.location || event.city || "Online Event"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <DollarSignIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-500">Price</div>
                      <div className="font-medium text-gray-900">{formatPrice()}</div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                {event.locationDetails?.address && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Venue Details</h3>
                    <p className="text-gray-600">{event.locationDetails.address}</p>
                    {event.locationDetails.directions && (
                      <p className="text-gray-600 mt-2">{event.locationDetails.directions}</p>
                    )}
                  </div>
                )}

                {event.onlineDetails?.meetingLink && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Online Event Details</h3>
                    <p className="text-gray-600 mb-2">Platform: {event.onlineDetails.platform}</p>
                    {event.onlineDetails.instructions && (
                      <p className="text-gray-600">{event.onlineDetails.instructions}</p>
                    )}
                  </div>
                )}

                {/* Speakers */}
                {event.speakers && event.speakers.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Speakers</h3>
                    <div className="space-y-4">
                      {event.speakers.map((speaker, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {speaker.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{speaker.name}</h4>
                            <p className="text-gray-600">{speaker.title}</p>
                            {speaker.company && (
                              <p className="text-gray-500 text-sm">{speaker.company}</p>
                            )}
                            {speaker.bio && (
                              <p className="text-gray-600 text-sm mt-2">{speaker.bio}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agenda */}
                {event.agenda && event.agenda.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Agenda</h3>
                    <div className="space-y-3">
                      {event.agenda.map((item, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-blue-600 min-w-[80px]">
                            {item.time}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            {item.description && (
                              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                            )}
                            {item.speaker && (
                              <p className="text-gray-500 text-sm mt-1">Speaker: {item.speaker}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Topics Covered</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Reveal delay={0.2}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Register for this Event</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatDate(event.startAt || event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4" />
                    <span>{formatTime(event.startAt || event.time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSignIcon className="h-4 w-4" />
                    <span>{formatPrice()}</span>
                  </div>
                  {event.capacity && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UsersIcon className="h-4 w-4" />
                      <span>{event.seatsRemaining || 0} seats remaining</span>
                    </div>
                  )}
                </div>

                {!isRegistrationOpen() ? (
                  <button 
                    disabled
                    className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg cursor-not-allowed font-medium"
                  >
                    Registration Closed
                  </button>
                ) : !hasAvailableSeats() ? (
                  <button 
                    disabled
                    className="w-full bg-red-400 text-white py-3 px-4 rounded-lg cursor-not-allowed font-medium"
                  >
                    Event Full
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsRegistrationModalOpen(true)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Register Now
                  </button>
                )}

                {event.organizer && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Organizer</h4>
                    <p className="text-gray-600 text-sm">{event.organizer}</p>
                    {event.organizerEmail && (
                      <p className="text-blue-600 text-sm mt-1">{event.organizerEmail}</p>
                    )}
                  </div>
                )}
              </div>
            </Reveal>

            {/* Materials */}
            {event.materials && event.materials.length > 0 && (
              <Reveal delay={0.3}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Materials</h3>
                  <div className="space-y-3">
                    {event.materials.map((material, index) => (
                      <a
                        key={index}
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-medium">
                            {material.type.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{material.title}</p>
                          {material.description && (
                            <p className="text-gray-500 text-xs">{material.description}</p>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      <EventRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        event={event}
      />
    </div>
  );
}
