import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import CtaButton from "@/components/cta-button";
import { GraduationCap, FileText, Plane, BookOpen, Users, Clock, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "All Services | Flyover Consultancy",
  description: "Comprehensive study abroad services including consultation, visa assistance, application support, and course selection. Expert guidance for your international education journey.",
};

interface Service {
  id: string;
  name: string;
  slug: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  benefits?: string[];
  process?: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  ctaLabel?: string;
  ctaText?: string;
}

async function getServices(): Promise<Service[]> {
  // During build time, skip API calls and return empty array
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_BASE_URL) {
    return [];
  }
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/services`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      console.error('API response not ok:', response.status);
      return [];
    }
    
    const data = await response.json();
    return data.services || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

// Icon mapping for services
const getServiceIcon = (serviceName: string) => {
  const name = serviceName.toLowerCase();
  if (name.includes('consultation') || name.includes('study')) return GraduationCap;
  if (name.includes('visa')) return Plane;
  if (name.includes('application')) return FileText;
  if (name.includes('course') || name.includes('selection')) return BookOpen;
  return GraduationCap; // default
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div>
      <PageHeader
        title="All Services"
        subtitle="Comprehensive support for every step of your study abroad journey"
        image="/hero/slide2.svg"
      />

      {/* Services Overview */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Services?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From initial consultation to visa approval, we provide expert guidance at every step. 
              Our comprehensive services are designed to make your study abroad dreams a reality.
            </p>
          </div>
        </Reveal>

        {/* Service Statistics */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-brand/10 rounded-lg">
                <Users className="w-6 h-6 text-brand" />
              </div>
              <div className="text-2xl font-bold text-gray-900">5000+</div>
              <div className="text-sm text-gray-600">Students Helped</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-brand/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-brand" />
              </div>
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-brand/10 rounded-lg">
                <Clock className="w-6 h-6 text-brand" />
              </div>
              <div className="text-2xl font-bold text-gray-900">15+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-brand/10 rounded-lg">
                <GraduationCap className="w-6 h-6 text-brand" />
              </div>
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Partner Universities</div>
            </div>
          </div>
        </Reveal>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {services.length > 0 ? services.map((service, i) => {
            const IconComponent = getServiceIcon(service.name);
            const serviceHref = `/services/${service.slug}`;
            const serviceTitle = service.title || service.name;
            const serviceDesc = service.description || service.subtitle || 'Professional service to help with your study abroad journey.';
            const serviceFeatures = service.features?.map(f => f.title) || service.benefits || ['Expert Guidance', 'Professional Support', 'Personalized Service', 'Quality Assurance'];
            
            return (
              <Reveal key={service.id} delay={i * 0.1}>
                <Link href={serviceHref} className="group">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Service Header */}
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand to-brand/80 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-8 h-8" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand transition-colors">
                          {serviceTitle}
                        </h3>
                        <p className="text-gray-600 mt-2">{serviceDesc}</p>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-4">
                      {/* Features */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">What&apos;s Included:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {serviceFeatures.slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Duration and Price */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Service</div>
                          <div className="text-sm font-medium text-gray-900">Professional</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Support</div>
                          <div className="text-sm font-medium text-brand">Expert Level</div>
                        </div>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Learn more about this service</span>
                        <div className="text-brand group-hover:translate-x-1 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          }) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No services available at the moment.</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <Reveal delay={0.4}>
          <div className="mt-16 bg-gradient-to-r from-brand to-brand/90 rounded-2xl p-8 md:p-12 text-center text-brand">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 text-brand-50">
              Get personalized guidance from our expert counselors. Book your free consultation today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CtaButton className="bg-brand text-white hover:bg-gray-50" />
              <Link 
                href="/contact" 
                className="px-8 py-3 border-2 border-white rounded-lg text-white hover:bg-white hover:text-brand transition-colors font-medium"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
