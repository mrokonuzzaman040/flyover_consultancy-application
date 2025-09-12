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

export default function ServicesPage() {
  const services = [
    { 
      href: "/services/study-consultation", 
      title: "Study Consultation", 
      desc: "Expert guidance to help you choose the right course and university for your goals.",
      icon: GraduationCap,
      features: ["University Selection", "Course Matching", "Career Guidance", "Country Comparison"],
      duration: "1-2 weeks",
      price: "Free Initial Consultation"
    },
    { 
      href: "/services/visa-assistance", 
      title: "Visa Assistance", 
      desc: "Complete support with visa applications, documentation, and interview preparation.",
      icon: Plane,
      features: ["Document Preparation", "Application Filing", "Interview Prep", "Status Tracking"],
      duration: "4-8 weeks",
      price: "Competitive Rates"
    },
    { 
      href: "/services/application-support", 
      title: "Application Support", 
      desc: "End-to-end assistance with university applications and admission processes.",
      icon: FileText,
      features: ["Application Review", "Essay Writing", "Document Verification", "Submission Support"],
      duration: "2-4 weeks",
      price: "Package Deals Available"
    },
    { 
      href: "/services/course-selection", 
      title: "Course Selection", 
      desc: "Personalized recommendations to find the perfect academic program for you.",
      icon: BookOpen,
      features: ["Program Analysis", "Career Alignment", "Skill Assessment", "Future Prospects"],
      duration: "1 week",
      price: "Included in Consultation"
    },
  ];

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
          {services.map((service, i) => {
            const IconComponent = service.icon;
            return (
              <Reveal key={service.href} delay={i * 0.1}>
                <Link href={service.href} className="group">
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
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mt-2">{service.desc}</p>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-4">
                      {/* Features */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">What&apos;s Included:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {service.features.map((feature, idx) => (
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
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Duration</div>
                          <div className="text-sm font-medium text-gray-900">{service.duration}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Pricing</div>
                          <div className="text-sm font-medium text-brand">{service.price}</div>
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
          })}
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
