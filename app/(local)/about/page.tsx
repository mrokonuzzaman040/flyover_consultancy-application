import type { Metadata } from "next";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import { Users, Globe, Award, BookOpen, Target, Heart, Star, TrendingUp } from "lucide-react";
import AnimatedCounter from "@/components/ui/animated-counter";
import Link from "next/link";

export const metadata: Metadata = { 
  title: "About Us | Flyover Consultancy",
  description: "Learn about Flyover Consultancy's mission to empower students with transparent, end-to-end guidance for international education."
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PageHeader
        title="About Flyover Consultancy"
        subtitle="Empowering dreams, bridging continents, and transforming lives through international education."
        image="/hero/slide2.svg"
      />

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-100/30 blur-3xl" />
      </div>

      <div className="relative">
        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                  Our Story
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Founded with a vision to democratize international education, Flyover Consultancy has been 
                  the trusted partner for thousands of students worldwide.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <Reveal>
                <div className="space-y-6">
                  <div className="prose prose-lg text-gray-700">
                    <p>
                      At Flyover Consultancy, we believe that every student deserves access to world-class education, 
                      regardless of their background or circumstances. Our journey began with a simple yet powerful 
                      mission: to break down barriers and create pathways for ambitious students to achieve their 
                      international education dreams.
                    </p>
                    <p>
                      What started as a small consultancy has grown into a comprehensive educational services platform, 
                       serving students across multiple continents. We&apos;ve helped thousands of students navigate the 
                       complex landscape of international admissions, visa processes, and cultural transitions.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="bg-gradient-to-br from-brand-50 to-blue-50 p-8 rounded-2xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                       <div className="text-3xl font-bold text-brand-600 mb-2">
                         <AnimatedCounter to={5000} />+
                       </div>
                       <p className="text-sm text-gray-600">Students Helped</p>
                     </div>
                     <div className="text-center">
                       <div className="text-3xl font-bold text-brand-600 mb-2">
                         <AnimatedCounter to={50} />+
                       </div>
                       <p className="text-sm text-gray-600">Countries Served</p>
                     </div>
                     <div className="text-center">
                       <div className="text-3xl font-bold text-brand-600 mb-2">
                         <AnimatedCounter to={95} />%
                       </div>
                       <p className="text-sm text-gray-600">Success Rate</p>
                     </div>
                     <div className="text-center">
                       <div className="text-3xl font-bold text-brand-600 mb-2">
                         <AnimatedCounter to={10} />+
                       </div>
                       <p className="text-sm text-gray-600">Years Experience</p>
                     </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Mission, Vision & Values */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                  Our Foundation
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Built on strong principles and driven by a clear vision for the future of international education.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-8 md:grid-cols-3">
              <Reveal>
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-600">
                    To empower students worldwide with transparent, comprehensive guidance and support 
                    throughout their international education journey, ensuring every dream has a pathway to reality.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600">
                    To be the world&apos;s most trusted platform for international education, creating a global 
                    community where geographical boundaries never limit educational aspirations.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Values</h3>
                  <p className="text-gray-600">
                    Transparency, integrity, and student-first approach guide everything we do. We believe 
                    in honest communication, ethical practices, and putting student success above all else.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* What Sets Us Apart */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                  What Sets Us Apart
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Our unique approach combines personalized guidance with cutting-edge technology 
                  to deliver exceptional results.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Reveal>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-200 transition-colors">
                    <Users className="w-8 h-8 text-brand-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Approach</h3>
                  <p className="text-gray-600 text-sm">
                    Every student receives tailored guidance based on their unique goals, background, and aspirations.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Support</h3>
                  <p className="text-gray-600 text-sm">
                    From university selection to visa assistance, we provide end-to-end support throughout your journey.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Proven Track Record</h3>
                  <p className="text-gray-600 text-sm">
                    With a 95% success rate, our results speak for themselves in helping students achieve their dreams.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Continuous Innovation</h3>
                  <p className="text-gray-600 text-sm">
                    We constantly evolve our services and technology to provide the best possible experience.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                  Leadership Team
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Meet the experienced professionals who guide our mission and ensure exceptional service delivery.
                </p>
              </div>
            </Reveal>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Executive Leadership</h3>
                <p className="text-gray-600 mb-4">
                  Our leadership team brings decades of combined experience in international education, 
                  student services, and global mobility.
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4 mr-2" />
                  Detailed profiles available in Admin Dashboard
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-brand-600 to-brand-700">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-xl text-brand-100 mb-8 max-w-3xl mx-auto">
                  Join thousands of successful students who have achieved their international education dreams with our guidance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-brand-600 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Get Free Consultation
                  </a>
                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border-2 border-white rounded-xl hover:bg-white hover:text-brand-600 transition-colors"
                  >
                    Explore Our Services
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}
