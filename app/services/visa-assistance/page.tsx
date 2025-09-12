import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import Reveal from "@/components/ui/reveal";
import CtaButton from "@/components/cta-button";
import { CheckCircle, FileText, Clock, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Visa Assistance | Flyover Consultancy",
  description: "Complete support with visa applications, documentation, and interview preparation.",
};

const services = [
  "Visa application form completion",
  "Document checklist and verification",
  "Interview preparation and coaching",
  "Application submission support",
  "Status tracking and follow-up",
  "Appeal and reapplication assistance"
];

const features = [
  {
    icon: FileText,
    title: "Document Management",
    description: "Comprehensive checklist and verification of all required documents for your visa application."
  },
  {
    icon: Clock,
    title: "Timely Processing",
    description: "Efficient handling of your application to meet deadlines and avoid delays."
  },
  {
    icon: Shield,
    title: "Success Guarantee",
    description: "High success rate with expert guidance and thorough preparation for your visa interview."
  }
];

const visaTypes = [
  { country: "Australia", types: ["Student Visa (Subclass 500)", "Graduate Work Visa (Subclass 485)"] },
  { country: "Canada", types: ["Study Permit", "Post-Graduation Work Permit (PGWP)"] },
  { country: "USA", types: ["F-1 Student Visa", "Optional Practical Training (OPT)"] },
  { country: "UK", types: ["Student Visa (Tier 4)", "Graduate Route Visa"] },
  { country: "Europe", types: ["National Student Visa", "EU Blue Card"] },
  { country: "New Zealand", types: ["Student Visa", "Post-Study Work Visa"] }
];

export default function VisaAssistancePage() {
  return (
    <div>
      <PageHeader
        title="Visa Assistance"
        subtitle="Complete support with visa applications, documentation, and interview preparation."
        image="/hero/slide2.svg"
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Overview Section */}
        <section className="mb-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Navigate Visa Requirements with Confidence
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Visa applications can be complex and stressful. Our experienced team provides comprehensive 
                support throughout the entire process, ensuring your application is complete, accurate, and submitted on time.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <Reveal>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Our Visa Services Include
                </h3>
                <ul className="space-y-4">
                  {services.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="bg-gradient-to-br from-brand-50 to-blue-50 p-8 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Why Our Visa Success Rate is 98%
                </h3>
                <p className="text-gray-700 mb-6">
                  Our team of visa experts stays updated with the latest immigration policies and requirements. 
                  We provide personalized guidance and ensure every detail of your application meets the 
                  specific requirements of your destination country.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-brand-600 mb-1">98%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-brand-600 mb-1">15+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How We Ensure Your Visa Success
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-brand-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Visa Types Section */}
        <section className="mb-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Visa Types We Handle
              </h2>
              <p className="text-lg text-gray-600">
                We provide assistance for all major student visa categories across popular study destinations.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visaTypes.map((country, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{country.country}</h3>
                  <ul className="space-y-2">
                    {country.types.map((type, typeIndex) => (
                      <li key={typeIndex} className="text-gray-600 text-sm flex items-start">
                        <span className="w-2 h-2 bg-brand-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {type}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Reveal>
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Visa Application?
              </h2>
              <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
                Let our visa experts guide you through the process and maximize your chances of approval.
              </p>
              <CtaButton />
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}