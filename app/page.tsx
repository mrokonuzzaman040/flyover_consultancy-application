"use client";

import LeadForm from "@/components/lead-form";
import Link from "next/link";
import Reveal from "@/components/ui/reveal";
import FloatingCta from "@/components/ui/floating-cta";
import HeroSlider from "@/components/hero-slider";
import Slider from "@/components/ui/slider";
import StarRating from "@/components/ui/star-rating";
import { UserCheck, FileText, Award, Plane, Home as Users, GraduationCap, Building2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  // Slider state and configuration
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Slider configuration
  const SLIDE_WIDTH = 272; // 256px + 16px gap
  const VISIBLE_SLIDES = 4; // Number of slides visible at once
  const AUTO_SCROLL_DELAY = 4000; // 4 seconds
  
  const destinations = [
    { 
      name: "Study in New Zealand", 
      subtitle: "Learn More",
      gradient: "from-blue-500 via-teal-500 to-green-500",
      icon: "🏔️",
      pattern: "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.15) 0%, transparent 50%)"
    },
    { 
      name: "Study in Malaysia", 
      subtitle: "Learn More",
      gradient: "from-red-500 via-yellow-500 to-blue-500",
      icon: "🏢",
      pattern: "radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)"
    },
    { 
      name: "Study in Japan", 
      subtitle: "Learn More",
      gradient: "from-pink-400 via-red-500 to-orange-500",
      icon: "🏯",
      pattern: "radial-gradient(circle at 30% 70%, rgba(255, 182, 193, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)"
    },
    { 
      name: "Study in Europe", 
      subtitle: "Learn More",
      gradient: "from-indigo-500 via-purple-500 to-blue-600",
      icon: "🏛️",
      pattern: "radial-gradient(circle at 40% 60%, rgba(99, 102, 241, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)"
    },
    { 
      name: "Study in Dubai", 
      subtitle: "Learn More",
      gradient: "from-yellow-400 via-orange-500 to-red-500",
      icon: "🏗️",
      pattern: "radial-gradient(circle at 50% 20%, rgba(255, 215, 0, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)"
    },
    { 
      name: "Study in Indonesia", 
      subtitle: "Learn More",
      gradient: "from-green-500 via-emerald-500 to-teal-600",
      icon: "🕌",
      pattern: "radial-gradient(circle at 35% 35%, rgba(34, 197, 94, 0.3) 0%, transparent 50%), radial-gradient(circle at 65% 65%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)"
    },
    { 
      name: "Study in Australia", 
      subtitle: "Learn More",
      gradient: "from-orange-400 via-yellow-500 to-red-500",
      icon: "🏖️",
      pattern: "radial-gradient(circle at 20% 60%, rgba(251, 146, 60, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 40%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)"
    },
    { 
      name: "Study in Canada", 
      subtitle: "Learn More",
      gradient: "from-red-500 via-white to-red-500",
      icon: "🍁",
      pattern: "radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.2) 0%, transparent 50%), radial-gradient(circle at 25% 75%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)"
    },
    { 
      name: "Study in UK", 
      subtitle: "Learn More",
      gradient: "from-blue-600 via-red-500 to-blue-600",
      icon: "🏰",
      pattern: "radial-gradient(circle at 30% 30%, rgba(37, 99, 235, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(239, 68, 68, 0.2) 0%, transparent 50%)"
    },
    { 
      name: "Study in USA", 
      subtitle: "Learn More",
      gradient: "from-blue-600 via-red-500 to-blue-600",
      icon: "🗽",
      pattern: "radial-gradient(circle at 40% 20%, rgba(37, 99, 235, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(239, 68, 68, 0.2) 0%, transparent 50%), radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 30%)"
    },
    { 
      name: "Study in Ireland", 
      subtitle: "Learn More",
      gradient: "from-green-600 via-emerald-500 to-green-700",
      icon: "🍀",
      pattern: "radial-gradient(circle at 45% 55%, rgba(34, 197, 94, 0.4) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)"
    }
  ];
  
  const maxSlide = Math.max(0, destinations.length - VISIBLE_SLIDES);
  
  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollInterval.current = setInterval(() => {
        setCurrentSlide(prev => {
          const nextSlide = prev + 1;
          return nextSlide > maxSlide ? 0 : nextSlide;
        });
      }, AUTO_SCROLL_DELAY);
    } else {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    }
    
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [isAutoScrolling, maxSlide]);
  
  // Slider navigation functions
  const goToSlide = (slideIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(slideIndex, maxSlide));
    setCurrentSlide(clampedIndex);
    setIsAutoScrolling(false);
    
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };
  
  const nextSlide = () => {
    goToSlide(currentSlide + 1);
  };
  
  const prevSlide = () => {
    goToSlide(currentSlide - 1);
  };
  
  // Smooth scroll effect
  useEffect(() => {
    if (sliderRef.current) {
      const translateX = -currentSlide * SLIDE_WIDTH;
      sliderRef.current.style.transform = `translateX(${translateX}px)`;
    }
  }, [currentSlide]);

  return (
    <div>
      {/* 1. Hero (image + text slider) */}
      <HeroSlider />

      {/* How Flyover Simplifies Your Study Abroad Journey */}
      <section className="py-12 section-muted relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-6 left-6 w-24 h-24 bg-brand rounded-full blur-2xl"></div>
          <div className="absolute bottom-12 right-12 w-28 h-28 bg-brand rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <Reveal>
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-brand/10 rounded-xl mb-4">
                <GraduationCap className="w-6 h-6 text-brand" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                How Flyover Simplifies Your
                <span className="text-brand block">Study Abroad Journey</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From consultation to destination, we guide you through every step with expert support.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
               { title: "Personalized Counseling", desc: "One-on-one sessions to understand your goals and create a tailored study plan.", icon: UserCheck },
               { title: "University Selection", desc: "Expert guidance in choosing universities and programs that align with your aspirations.", icon: Building2 },
               { title: "Application Support", desc: "Comprehensive assistance with forms, essays, and documentation for acceptance.", icon: FileText },
               { title: "Visa Assistance", desc: "Step-by-step visa guidance and interview preparation for smooth approval.", icon: Award },
               { title: "Pre-departure Support", desc: "Complete orientation covering accommodation, travel, and cultural preparation.", icon: Plane },
               { title: "Post-arrival Assistance", desc: "Ongoing support to help you settle in and succeed in your new environment.", icon: Users },
             ].map((f, i) => {
               const IconComponent = f.icon;
               return (
                 <Reveal key={f.title} delay={i * 0.08} variant="scale">
                    <div className="group relative bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-100 overflow-hidden">
                      {/* Cut-out corner */}
                      <div className="absolute top-0 right-0 w-4 h-4 bg-brand/5 transform rotate-45 translate-x-2 -translate-y-2"></div>
                      
                      {/* Icon */}
                      <div className="inline-flex items-center justify-center w-8 h-6 bg-gradient-to-r from-brand/8 to-brand/4 rounded-md mb-3 group-hover:scale-105 transition-transform duration-150">
                        <IconComponent className="w-4 h-4 text-brand" />
                      </div>
                      
                      <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-brand transition-colors duration-150">
                        {f.title}
                      </h3>
                      <p className="text-gray-600 text-xs leading-snug">
                        {f.desc}
                      </p>
                      
                      {/* Hover accent */}
                      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-brand to-brand-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-150 origin-left"></div>
                    </div>
                  </Reveal>
               );
             })}
          </div>
        </div>
      </section>

      {/* 3. Gain Access to Top Institutions across the Globe */}
      <section className="section-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Gain Access to Top Institutions across the Globe</h2>
          <p className="mt-2 text-gray-700">PFEC Global is a partner of renowned institutions across 11 countries.</p>
          <p className="text-gray-700">Pick a destination below and learn everything you need to make an informed decision.</p>
          
          <div className="mt-8 relative">
            {/* Navigation arrows */}
            <button 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              disabled={currentSlide >= maxSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Auto-scroll toggle */}
            <button 
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className="absolute top-0 right-0 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
              title={isAutoScrolling ? "Pause auto-scroll" : "Resume auto-scroll"}
            >
              {isAutoScrolling ? (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            
            {/* Slider container */}
            <div className="overflow-hidden rounded-xl">
              <div 
                ref={sliderRef}
                className="flex gap-4 transition-transform duration-500 ease-in-out"
                onMouseEnter={() => setIsAutoScrolling(false)}
                onMouseLeave={() => setIsAutoScrolling(true)}
              >
                {destinations.map((destination) => (
                  <div key={destination.name} className="relative flex-shrink-0 w-64 h-48 rounded-lg overflow-hidden group cursor-pointer shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                    <div className={`w-full h-full bg-gradient-to-br ${destination.gradient}`}
                         style={{ backgroundImage: destination.pattern }}></div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors"></div>
                    <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity duration-200">
                      {destination.icon}
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-semibold drop-shadow-lg">{destination.name}</h3>
                      <p className="text-sm opacity-90 drop-shadow-lg">{destination.subtitle}</p>
                    </div>
                  </div>
                ))}
               </div>
            </div>
            
            {/* Slide indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: maxSlide + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentSlide 
                      ? 'bg-blue-600 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Study abroad in just 5 steps */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Study Abroad in Just 5 Steps</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { t: "Book consultation" },
            { t: "Shortlist programs" },
            { t: "Apply & get offers" },
            { t: "Visa approval" },
            { t: "Fly & settle" },
          ].map((s, i) => (
            <li key={i} className="card p-5">
              <div className="text-3xl font-extrabold text-brand">{i + 1}</div>
              <div className="mt-2 text-gray-900 font-semibold">{s.t}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. Why Choose Us */}
      <section className="section-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Why Choose Us</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["End-to-end FREE assistance", "22,000+ success stories", "550+ global partners", "Transparent, ethical guidance"].map((t, i) => (
              <div key={i} className="card p-5">
                <div className="text-gray-900 font-semibold">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Awards & achievements */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Awards & Achievements</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="text-gray-900 font-semibold">Award Title {i + 1}</div>
              <p className="mt-1 text-sm text-gray-700">Recognition for excellence in student services.</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Upcoming Events */}
      <section className="section-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Upcoming Events</h2>
            <Link href="/events" className="text-sm font-semibold text-brand">View all</Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <article key={i} className="card p-5">
                <div className="text-sm text-gray-500">Jan {i + 10}, 2025 • Dhaka</div>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">Study Abroad Fair</h3>
                <p className="mt-1 text-sm text-gray-700">Meet university representatives and explore scholarships.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Our Industry Partnerships */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Industry Partnerships</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex h-16 items-center justify-center rounded-md border bg-white text-sm font-semibold text-gray-700">
              Partner {i + 1}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Success Stories — review slider */}
      <section className="section-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">22,000+ Success Stories — You could be the next</h2>
          <Slider className="mt-6" autoplayMs={6000}>
            {[0, 1].map((s) => (
              <div key={s} className="px-1">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="card p-5 bg-white">
                      <StarRating value={5} />
                      <p className="mt-2 text-sm text-gray-700">“Helpful counselors and a smooth visa process. Highly recommend!”</p>
                      <div className="mt-3 text-sm font-medium text-gray-900">Student Name</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* 10. Insights to Keep You Ahead */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Insights to Keep You Ahead</h2>
          <Link href="/resources" className="text-sm font-semibold text-brand">View all</Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <article key={i} className="card p-5">
              <div className="text-sm text-gray-500">Author • 5 min read</div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">Latest Article {i}</h3>
              <p className="mt-1 text-sm text-gray-700">Short excerpt from the latest resource article.</p>
            </article>
          ))}
        </div>
      </section>

      {/* 11. Contact Us */}
      <section className="section-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-start gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Contact Us</h2>
              <p className="mt-2 text-gray-700">Have questions? Send us an enquiry and a counselor will get back to you.</p>
              <div className="mt-6">
                <LeadForm purpose="enquiry" />
              </div>
            </div>
            <div className="card p-5">
              <h3 className="text-lg font-semibold text-gray-900">Offices</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>Dhaka — +880-000-000000</li>
                <li>Chittagong — +880-000-000000</li>
              </ul>
              <div className="mt-4 aspect-video w-full bg-gray-100" aria-hidden />
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA */}
      <FloatingCta />
    </div>
  );
}
