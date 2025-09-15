import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import LazyImage from "@/components/ui/lazy-image";
import { Users, GraduationCap, Globe, Star, ArrowRight } from "lucide-react";

interface University {
  name: string;
  location: string;
  ranking?: string;
  image?: string;
  courses: string[];
  description?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Destination {
  id: string;
  country: string;
  slug: string;
  flag?: string;
  image?: string;
  description?: string;
  highlights: string[];
  universities?: University[] | string | null;
  students?: string;
  popularCities: string[];
  averageCost?: string;
  workRights?: string;
  color?: string;
  hero?: string;
  overviewMD?: string;
  costsMD?: string;
  intakesMD?: string;
  visaMD?: string;
  scholarshipsMD?: string;
  popularCourses: string[];
  faqs?: FAQ[] | null;
  createdAt: string;
}

export const metadata: Metadata = {
  title: "Study Destinations | Flyover Consultancy",
  description: "Explore top study destinations including Australia, Canada, USA, UK, Europe, New Zealand, and Japan. Find universities, costs, visas, and more.",
};

// This will be replaced with dynamic data from API

const stats = [
  { icon: Globe, label: "Countries", value: "50+" },
  { icon: GraduationCap, label: "Partner Universities", value: "500+" },
  { icon: Users, label: "Students Placed", value: "22,000+" },
  { icon: Star, label: "Success Rate", value: "98%" }
];

async function getDestinations() {
  try {
    // First try to fetch from API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/destinations`, {
      next: { revalidate: 3600 }, // Revalidate every hour
      cache: 'force-cache'
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.destinations && data.destinations.length > 0) {
        return data.destinations;
      }
    }
  } catch (error) {
    console.log('API not available, using test data:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  // Fallback to test data
  try {
    const testData = await import('@/data/destinations-test-data.json');
    return testData.destinations || [];
  } catch (error) {
    console.error('Error loading test data:', error);
    return [];
  }
}

export default async function DestinationsPage() {
  const countries = await getDestinations();
  
  // If no countries are available, show a message
  const hasCountries = countries && countries.length > 0;
  return (
    <div>
      <PageHeader
        title="Study Destinations"
        subtitle="Choose your dream country and explore universities, costs, visas, intakes and more. Your journey to global education starts here."
        image="/hero/slide1.svg"
      />

      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-brand-50 to-brand-100 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Global Education Network</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Connect with top universities worldwide through our extensive network and expert guidance.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 text-white rounded-full mb-4">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Study Destinations</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover detailed information about each destination including universities, costs, visa requirements, and student life.
              </p>
            </div>
          </Reveal>
          
          {!hasCountries ? (
            <div className="text-center py-16">
              <div className="mx-auto max-w-md">
                <Globe className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Destinations Available</h3>
                <p className="text-gray-600 mb-6">
                   We&apos;re currently updating our destination information. Please check back soon or contact us for assistance.
                 </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {countries.map((country: Destination, index: number) => (
                <Reveal key={country.slug} delay={index * 0.1}>
                <Link 
                  href={`/destinations/${country.slug}`} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-[650px] flex flex-col transform hover:-translate-y-1"
                  aria-label={`Learn more about studying in ${country.country}`}
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <LazyImage
                      src={country.image || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80`}
                      alt={`Study abroad in ${country.country} - Universities and education opportunities`}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <ArrowRight className="w-6 h-6 text-white drop-shadow-lg group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="text-4xl drop-shadow-lg">{country.flag}</div>
                    </div>
                  </div>
                  
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${country.color} p-6 text-white flex-shrink-0`}>
                    <h3 className="text-2xl font-bold mb-2">{country.country}</h3>
                    <p className="text-white/90 text-sm leading-relaxed line-clamp-3">{country.description}</p>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Universities</div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {Array.isArray(country.universities) ? `${country.universities.length}+` : 
                           typeof country.universities === 'string' ? country.universities : 
                           'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Students</div>
                        <div className="font-semibold text-gray-900 text-sm">{country.students}</div>
                      </div>
                    </div>
                    
                    {/* Highlights */}
                    <div className="mb-6 flex-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Key Highlights</div>
                      <div className="flex flex-wrap gap-2">
                        {country.highlights.map((highlight: string, idx: number) => (
                          <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Additional Info */}
                    <div className="space-y-3 text-sm mt-auto">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Average Cost:</span>
                        <span className="font-medium text-gray-900 text-right">{country.averageCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Work Rights:</span>
                        <span className="font-medium text-gray-900">{country.workRights}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-gray-500">Popular Cities:</span>
                        <span className="font-medium text-gray-900 text-right">{country.popularCities.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Global Education Journey?
            </h2>
            <p className="text-xl text-brand-100 mb-8">
              Get personalized guidance for your chosen destination. Our experts will help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/book-consultation" 
                className="bg-white text-brand-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Book Free Consultation
              </a>
              <a 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-brand-600 transition-colors duration-200"
              >
                Contact Our Experts
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
