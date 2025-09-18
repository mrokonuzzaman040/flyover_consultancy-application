import type { Metadata } from "next";
import LeadForm from "@/components/lead-form";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import { MapPin, Phone, Mail, Clock, Globe, Users } from "lucide-react";

export const metadata: Metadata = { 
  title: "Contact Us | Flyover Consultancy",
  description: "Get in touch with Flyover Consultancy for study abroad guidance. Contact our offices in Dhaka and Chittagong or submit an online enquiry."
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-50/30">
      {/* Enhanced Page Header */}
      <PageHeader 
        title="Contact Us" 
        subtitle="Ready to start your study abroad journey? Get in touch with our expert consultants today." 
        image="/hero/slide1.svg" 
      />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-brand-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-brand-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Contact Information Cards */}
        <div className="mb-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get in <span className="text-brand-600">Touch</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We&apos;re here to help you achieve your study abroad dreams. Reach out through any of the channels below.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Reveal delay={0.1}>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-200 transition-colors">
                  <MapPin className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  House 123, Road 456<br />
                  Dhanmondi, Dhaka 1205<br />
                  Bangladesh
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-200 transition-colors">
                  <Phone className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  +8801703666064 - Mahfujur Rahaman Bulbul (Director)<br />
                  +8801310338691 - Rakibul Islam (Sr. Manager)<br />
                  +8801301523004 - Arnab Chowdhury (Sr. Manager)
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-200 transition-colors">
                  <Mail className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  info.flyoverconsultancy@gmail.com
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-200 transition-colors">
                  <Clock className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Mon - Fri: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Reveal delay={0.1}>
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Send us a <span className="text-brand-600">Message</span>
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and our expert consultants will get back to you within 24 hours.
                  </p>
                </div>
                <LeadForm purpose="enquiry" />
              </div>
            </Reveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Office Locations */}
            <Reveal delay={0.2}>
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-brand-600" />
                  Our Offices
                </h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-brand-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Dhaka Office</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      House 123, Road 456, Dhanmondi<br />
                      Dhaka 1205, Bangladesh
                    </p>
                    <p className="text-sm text-brand-600 font-medium mt-2">
                      +8801703666064
                    </p>
                  </div>
                  <div className="border-l-4 border-brand-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Chittagong Office</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Building 789, GEC Circle<br />
                      Chittagong 4000, Bangladesh
                    </p>
                    <p className="text-sm text-brand-600 font-medium mt-2">
                      +8801310338691
                    </p>
                  </div>
                </div>
                
                {/* Interactive Map Placeholder */}
                <div className="mt-6 aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-brand-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Interactive Map</p>
                    <p className="text-xs text-gray-500">Coming Soon</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Quick Stats */}
            <Reveal delay={0.3}>
              <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-6 text-white">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Why Choose Us?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold">5K+</span>
                    </div>
                    <span className="text-sm">Students Placed Successfully</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold">98%</span>
                    </div>
                    <span className="text-sm">Visa Success Rate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold">15+</span>
                    </div>
                    <span className="text-sm">Years of Experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold">50+</span>
                    </div>
                    <span className="text-sm">Partner Universities</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
