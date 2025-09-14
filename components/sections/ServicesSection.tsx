"use client";

import { UserCheck, FileText, Award, Plane, ArrowRight, CheckCircle, Clock, Users, Star } from "lucide-react";
import { useState } from "react";

const services = [
  {
    icon: UserCheck,
    title: "Personalized Counseling",
    description: "Get expert guidance tailored to your academic goals and career aspirations.",
    features: ["1-on-1 Expert Sessions", "Career Path Analysis", "Goal Setting & Planning"],
    duration: "30-60 mins",
    price: "Free Consultation",
    popular: true
  },
  {
    icon: FileText,
    title: "Application Support",
    description: "Complete assistance with university applications, essays, and documentation.",
    features: ["Essay Writing Help", "Document Review", "Application Tracking"],
    duration: "2-4 weeks",
    price: "Starting $299",
    popular: false
  },
  {
    icon: Award,
    title: "Scholarship Guidance",
    description: "Discover and apply for scholarships to fund your international education.",
    features: ["Scholarship Search", "Application Assistance", "Interview Prep"],
    duration: "1-3 weeks",
    price: "Starting $199",
    popular: false
  },
  {
    icon: Plane,
    title: "Visa & Travel Support",
    description: "Navigate visa processes and pre-departure preparations with confidence.",
    features: ["Visa Documentation", "Interview Preparation", "Travel Planning"],
    duration: "3-6 weeks",
    price: "Starting $399",
    popular: true
  }
];

const stats = [
  { icon: Users, value: "5,000+", label: "Students Helped" },
  { icon: CheckCircle, value: "98%", label: "Success Rate" },
  { icon: Star, value: "4.9/5", label: "Client Rating" },
  { icon: Clock, value: "15+", label: "Years Experience" }
];

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(0);

  return (
    <section className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 py-24 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-brand-400/10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-8 border border-white/20">
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Comprehensive Services
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8 leading-tight">
            Transform Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-brand-300">
              Study Abroad
            </span>
            {' '}Dreams
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-12">
            From personalized counseling to visa success, we provide end-to-end support with proven results. 
            Join thousands of students who achieved their international education goals with Flyover.
          </p>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-3">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Services Grid - Enhanced Design */}
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isActive = activeService === index;
            
            return (
              <div 
                key={index}
                onMouseEnter={() => setActiveService(index)}
                className={`group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 cursor-pointer ${
                  isActive 
                    ? 'border-white/40 bg-white/15 scale-105 shadow-2xl shadow-white/10' 
                    : 'border-white/20 hover:border-white/30 hover:bg-white/12 hover:scale-102'
                }`}
              >
                {/* Popular Badge */}
                {service.popular && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-12 translate-x-12 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-br from-white/30 to-white/20 scale-110' 
                      : 'bg-gradient-to-br from-white/20 to-white/10 group-hover:scale-110'
                  }`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-200 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-white/90">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  {/* Service Details */}
                  <div className="flex items-center justify-between text-sm text-white/70 mb-6">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {service.duration}
                    </div>
                    <div className="font-semibold text-white">
                      {service.price}
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <button className="w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center group-hover:shadow-lg border border-white/20 hover:border-white/40">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-white text-brand-700 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Get Started Today
            </button>
            <button className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300">
              Schedule Free Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}