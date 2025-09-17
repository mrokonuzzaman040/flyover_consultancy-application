"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { ArrowLeft, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/utils/error-handling';

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

interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  location: string;
  specialRequirements: string;
  emergencyContact: string;
  howHear: string;
  expectations: string;
  questions: string;
}

export default function EventRegistrationPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    location: '',
    specialRequirements: '',
    emergencyContact: '',
    howHear: '',
    expectations: '',
    questions: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/events/${resolvedParams.slug}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data.event);
        } else {
          toast.error('Event not found');
          router.push('/events');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Error loading event');
        router.push('/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/event-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event._id || event.id,
          ...formData
        }),
      });

      if (response.ok) {
        toast.success('Registration successful! You will receive a confirmation email shortly.');
        router.push('/events');
      } else {
        const errorMessage = await getApiErrorMessage(response, 'Registration failed. Please try again.');
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (event: Event) => {
    if (event.startAt) {
      return new Date(event.startAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    if (event.date) {
      return event.date;
    }
    return 'TBD';
  };

  const formatTime = (event: Event) => {
    if (event.startAt && event.endAt) {
      const start = new Date(event.startAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      const end = new Date(event.endAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `${start} - ${end}`;
    }
    if (event.time) {
      return event.time;
    }
    return 'TBD';
  };

  const formatPrice = (event: Event) => {
    if (event.isFree) return "Free";
    if (event.price && event.currency) {
      return `${event.currency} ${event.price}`;
    }
    return "Free";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <button
            onClick={() => router.push('/events')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Events
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Event Registration</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Event Details */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 lg:sticky lg:top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{event.title}</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Date</p>
                    <p className="text-sm text-gray-600">{formatDate(event)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Time</p>
                    <p className="text-sm text-gray-600">{formatTime(event)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">{event.location || 'TBD'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Price</p>
                    <p className="text-sm text-gray-600">{formatPrice(event)}</p>
                  </div>
                </div>

                {event.capacity && (
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Capacity</p>
                      <p className="text-sm text-gray-600">
                        {event.seatsRemaining || event.capacity} seats remaining
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Registration Form</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base touch-manipulation"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base touch-manipulation"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base touch-manipulation"
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base touch-manipulation"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base touch-manipulation"
                      />
                    </div>

                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base touch-manipulation"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="howHear" className="block text-sm font-medium text-gray-700 mb-1">
                        How did you hear about this event?
                      </label>
                      <select
                        id="howHear"
                        name="howHear"
                        value={formData.howHear}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base touch-manipulation"
                      >
                        <option value="">Select an option</option>
                        <option value="social-media">Social Media</option>
                        <option value="website">Website</option>
                        <option value="email">Email</option>
                        <option value="friend">Friend/Colleague</option>
                        <option value="search-engine">Search Engine</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="expectations" className="block text-sm font-medium text-gray-700 mb-1">
                        What are your expectations from this event?
                      </label>
                      <textarea
                        id="expectations"
                        name="expectations"
                        value={formData.expectations}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base touch-manipulation"
                      />
                    </div>

                    <div>
                      <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requirements (Dietary, Accessibility, etc.)
                      </label>
                      <textarea
                        id="specialRequirements"
                        name="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base touch-manipulation"
                      />
                    </div>

                    <div>
                      <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Contact
                      </label>
                      <input
                        type="text"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base touch-manipulation"
                      />
                    </div>

                    <div>
                      <label htmlFor="questions" className="block text-sm font-medium text-gray-700 mb-1">
                        Questions or Comments
                      </label>
                      <textarea
                        id="questions"
                        name="questions"
                        value={formData.questions}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base touch-manipulation"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[48px]"
                  >
                    {submitting ? 'Registering...' : 'Register for Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
