import type { Metadata } from "next";
import { CalendarIcon, ClockIcon, UsersIcon, VideoIcon, ArrowRightIcon, StarIcon, TrendingUpIcon, GlobeIcon } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import CtaButton from "@/components/cta-button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Events & Webinars | Flyover Consultancy",
  description: "Join our upcoming events, webinars, and workshops to get expert guidance on studying abroad, visa applications, and university admissions.",
};

const upcomingEvents = [
  {
    id: 1,
    title: "Study in Canada: Complete Guide 2025",
    description: "Comprehensive overview of Canadian universities, application processes, visa requirements, and post-graduation opportunities.",
    date: "2025-02-15",
    time: "2:00 PM EST",
    duration: "90 minutes",
    type: "webinar",
    speaker: "Sarah Johnson",
    speakerTitle: "Senior Education Consultant",
    attendees: 245,
    maxAttendees: 500,
    price: "Free",
    topics: ["University Selection", "Application Process", "Visa Requirements", "Cost of Living"],
    featured: true,
    registrationLink: "#register-canada"
  },
  {
    id: 2,
    title: "UK University Applications Workshop",
    description: "Interactive workshop covering UCAS applications, personal statements, and interview preparation for UK universities.",
    date: "2025-02-20",
    time: "10:00 AM GMT",
    duration: "2 hours",
    type: "workshop",
    speaker: "Michael Chen",
    speakerTitle: "UK Education Specialist",
    attendees: 156,
    maxAttendees: 300,
    price: "$29",
    topics: ["UCAS Application", "Personal Statement", "Interview Prep", "Scholarship Tips"],
    featured: false,
    registrationLink: "#register-uk"
  },
  {
    id: 3,
    title: "Scholarship Opportunities & Funding Guide",
    description: "Discover available scholarships, grants, and funding options for international students across different countries.",
    date: "2025-02-25",
    time: "3:00 PM EST",
    duration: "75 minutes",
    type: "webinar",
    speaker: "Emma Wilson",
    speakerTitle: "Financial Aid Advisor",
    attendees: 189,
    maxAttendees: 400,
    price: "Free",
    topics: ["Merit Scholarships", "Need-based Aid", "Government Grants", "Application Tips"],
    featured: false,
    registrationLink: "#register-scholarships"
  },
  {
    id: 4,
    title: "Australia Study & Work Opportunities",
    description: "Learn about Australian universities, student visa process, and post-study work opportunities in Australia.",
    date: "2025-03-05",
    time: "1:00 PM AEDT",
    duration: "2 hours",
    type: "seminar",
    speaker: "David Brown",
    speakerTitle: "Australia Education Expert",
    attendees: 98,
    maxAttendees: 250,
    price: "Free",
    topics: ["University Rankings", "Visa Process", "Work Rights", "PR Pathways"],
    featured: true,
    registrationLink: "#register-australia"
  }
];

const pastEvents = [
  {
    title: "USA University Fair 2024",
    date: "2024-12-15",
    attendees: 450,
    rating: 4.8,
    recordingAvailable: true
  },
  {
    title: "European Study Options Webinar",
    date: "2024-12-10",
    attendees: 320,
    rating: 4.9,
    recordingAvailable: true
  },
  {
    title: "IELTS Preparation Workshop",
    date: "2024-11-28",
    attendees: 280,
    rating: 4.7,
    recordingAvailable: false
  }
];

function EventCard({ event, index }: { event: typeof upcomingEvents[0]; index: number }) {
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'webinar': return VideoIcon;
      case 'workshop': return UsersIcon;
      case 'seminar': return GlobeIcon;
      default: return CalendarIcon;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'webinar': return 'bg-blue-50 text-blue-600';
      case 'workshop': return 'bg-green-50 text-green-600';
      case 'seminar': return 'bg-purple-50 text-purple-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const IconComponent = getEventTypeIcon(event.type);
  const attendancePercentage = (event.attendees / event.maxAttendees) * 100;

  return (
    <Reveal delay={index * 0.1}>
      <div className={`relative rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 ${event.featured ? 'ring-2 ring-blue-500 ring-opacity-20' : ''}`}>
        {event.featured && (
          <div className="absolute -top-3 -right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <StarIcon className="h-3 w-3" />
            Featured
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className={`inline-flex rounded-xl p-2 ${getEventTypeColor(event.type)}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">{event.price}</div>
            <div className="text-xs text-gray-500 capitalize">{event.type}</div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="h-4 w-4" />
            <span>{event.time} • {event.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UsersIcon className="h-4 w-4" />
            <span>{event.attendees} registered</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1.5 ml-2">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs font-medium text-gray-700 mb-2">Topics Covered:</div>
          <div className="flex flex-wrap gap-1">
            {event.topics.slice(0, 3).map((topic, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {topic}
              </span>
            ))}
            {event.topics.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{event.topics.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-medium text-gray-900">{event.speaker}</div>
              <div className="text-xs text-gray-500">{event.speakerTitle}</div>
            </div>
          </div>
          <Link href={event.registrationLink} className="w-full">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
              Register Now
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

export default function EventsPage() {
  const featuredEvents = upcomingEvents.filter(event => event.featured);

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
                <EventCard key={event.id} event={event} index={index} />
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
                <span>{upcomingEvents.length} events scheduled</span>
              </div>
            </div>
          </Reveal>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
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
              <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All Recordings
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          
          <div className="grid gap-6 md:grid-cols-3">
            {pastEvents.map((event, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3">{event.title}</h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UsersIcon className="h-4 w-4" />
                      <span>{event.attendees} attendees</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <StarIcon className="h-4 w-4 text-yellow-500" />
                      <span>{event.rating}/5.0 rating</span>
                    </div>
                  </div>
                  {event.recordingAvailable ? (
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                      <VideoIcon className="h-4 w-4" />
                      Watch Recording
                    </Link>
                  ) : (
                    <span className="text-gray-400 text-sm">Recording not available</span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Reveal delay={0.4}>
          <div className="text-center rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Never Miss an Event</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to get notified about upcoming events, webinars, and exclusive workshops.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <CtaButton href="#" className="bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap">
                Subscribe Now
              </CtaButton>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
