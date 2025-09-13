import type { Metadata } from "next";
import LeadForm from "@/components/lead-form";
import { Calendar, Clock, Users, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a Free Consultation | Flyover Consultancy",
  description: "Schedule your free consultation with our expert study abroad advisors. Get personalized guidance for your international education journey.",
};

export default function BookConsultationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-600 to-brand-700 py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Book Your Free
              <span className="block text-yellow-300">Consultation</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-brand-100">
              Get expert guidance from our certified study abroad counselors. 
               We&apos;ll help you navigate your international education journey.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
                <Calendar className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Flexible Scheduling</h3>
              <p className="mt-2 text-sm text-gray-600">Choose a time that works best for you</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
                <Users className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Expert Counselors</h3>
              <p className="mt-2 text-sm text-gray-600">Certified professionals with years of experience</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
                <Clock className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Quick Response</h3>
              <p className="mt-2 text-sm text-gray-600">We&apos;ll contact you within 24 hours</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
                <CheckCircle className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Completely Free</h3>
              <p className="mt-2 text-sm text-gray-600">No hidden charges or commitments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Schedule Your Consultation</h2>
              <p className="mt-2 text-brand-100">
                Fill out the form below and our expert counselors will contact you to confirm the time and discuss your study abroad goals.
              </p>
            </div>
            <div className="p-8">
              <LeadForm purpose="consultation" />
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">Trusted by Thousands of Students</h3>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-600">5000+</div>
                <div className="mt-2 text-sm text-gray-600">Students Counseled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-600">95%</div>
                <div className="mt-2 text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-600">50+</div>
                <div className="mt-2 text-sm text-gray-600">Partner Universities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
