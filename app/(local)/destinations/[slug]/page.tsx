import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import { dbConnect, toObject } from "@/lib/mongoose";
import DestinationModel from "@/lib/models/Destination";
import { MapPin, Users, GraduationCap, ArrowRight, Calendar, DollarSign, FileText, Award, Heart, Star, TrendingUp, Clock, Shield, BookOpen, Building2} from "lucide-react";
import { UniversityImage } from "@/components/ui/lazy-image";

type University = {
  name: string;
  location?: string;
  ranking?: string;
  image?: string;
  courses?: string[];
};

type FAQ = {
  question: string;
  answer: string;
};

type Destination = {
  id?: string;
  country: string;
  slug: string;
  flag?: string;
  image?: string;
  description?: string;
  highlights?: string[];
  universities?: University[] | string | null;
  students?: string;
  popularCities?: string[];
  averageCost?: string;
  workRights?: string;
  color?: string;
  hero?: string;
  overviewMD?: string;
  costsMD?: string;
  intakesMD?: string;
  visaMD?: string;
  scholarshipsMD?: string;
  popularCourses?: string[];
  faqs?: FAQ[] | string | null;
  createdAt?: string;
};

let cachedFallback: Destination[] | null = null;

async function loadFallbackDestinations() {
  if (cachedFallback) return cachedFallback;

  try {
    const testData = await import('@/data/destinations-test-data.json');
    cachedFallback = testData.destinations || [];
    return cachedFallback;
  } catch (error) {
    console.error('Error loading test data for destination:', error);
    cachedFallback = [];
    return cachedFallback;
  }
}

async function getDestination(slug: string) {
  if (process.env.MONGODB_URI) {
    try {
      await dbConnect();
      const doc = await DestinationModel.findOne({ slug }).lean();
      if (doc) {
        const normalized = toObject(doc as { _id: unknown });
        return normalized as unknown as Destination;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Failed to load destination from database, using test data:', message);
      }
    }
  }

  const destinations = await loadFallbackDestinations();
  return destinations.find((dest) => dest.slug === slug) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestination(slug);
  
  if (!destination) {
    return {
      title: "Country Not Found | Flyover Consultancy",
      description: "The requested study destination was not found."
    };
  }

  return {
    title: `Study in ${destination.country} | Flyover Consultancy`,
    description: `Complete guide to studying in ${destination.country}. Universities, costs, visas, scholarships, and more. ${destination.description}`
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = await getDestination(slug);

  if (!destination) {
    notFound();
  }

  // Parse markdown content if available
  const overviewMD = destination.overviewMD || '';
  const costsMD = destination.costsMD || '';
  const intakesMD = destination.intakesMD || '';
  const visaMD = destination.visaMD || '';
  const scholarshipsMD = destination.scholarshipsMD || '';

  // Parse FAQs if available
  const faqs = destination.faqs ? (typeof destination.faqs === 'string' ? JSON.parse(destination.faqs) : destination.faqs) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <PageHeader
        title={`Study in ${destination.country}`}
        subtitle={destination.description}
        image={"/hero/slide1.svg"}
      />

      {/* Enhanced Quick Overview */}
      <section className="py-20 bg-gradient-to-br from-white via-brand-50/30 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(227,6,19,0.05),transparent_50%)] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-8xl mb-6 transform hover:scale-110 transition-transform duration-300">{destination.flag}</div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
                Quick Overview
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Get a comprehensive snapshot of studying in {destination.country}
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <Reveal delay={0.1}>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Universities</div>
                <div className="font-bold text-gray-900 text-xl">{Array.isArray(destination.universities) ? `${destination.universities.length}+` : 'N/A'}</div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Students</div>
                <div className="font-bold text-gray-900 text-xl">{destination.students}</div>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Average Cost</div>
                <div className="font-bold text-gray-900 text-xl">{destination.averageCost}</div>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Work Rights</div>
                <div className="font-bold text-gray-900 text-xl">{destination.workRights}</div>
              </div>
            </Reveal>
            <Reveal delay={0.5}>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Popular Cities</div>
                <div className="font-bold text-gray-900 text-sm leading-tight">{destination.popularCities?.join(', ') || 'N/A'}</div>
              </div>
            </Reveal>
            <Reveal delay={0.6}>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Highlights</div>
                <div className="font-bold text-gray-900 text-sm leading-tight">{destination.highlights?.slice(0, 2).join(', ') || 'N/A'}</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Enhanced Education System */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(227,6,19,0.03),transparent_50%)] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl mb-6">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
                Education System
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover the academic excellence and research opportunities available in {destination.country}. 
                Experience world-class education with cutting-edge facilities and renowned faculty.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <Reveal delay={0.1}>
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent mb-2">
                  {Array.isArray(destination.universities) ? `${destination.universities.length}+` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600 font-medium">Universities</div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-2">
                  {destination.students}
                </div>
                <div className="text-sm text-gray-600 font-medium">International Students</div>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent mb-2">
                  {destination.averageCost}
                </div>
                <div className="text-sm text-gray-600 font-medium">Average Cost</div>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
                  {destination.workRights}
                </div>
                <div className="text-sm text-gray-600 font-medium">Work Rights</div>
              </div>
            </Reveal>
            <Reveal delay={0.5}>
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">
                  {destination.popularCities?.length || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">Popular Cities</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Enhanced Overview Content */}
      {overviewMD && (
        <section className="py-20 bg-gradient-to-br from-white via-slate-50/50 to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(227,6,19,0.02),transparent_70%)] pointer-events-none"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <Reveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
                  Country Overview
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Discover what makes {destination.country} an exceptional study destination
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50">
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">About {destination.country}</h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-brand-500 to-brand-600 mx-auto rounded-full"></div>
                  </div>
                  
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                            <GraduationCap className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900">Education Excellence</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {destination.country} is renowned for its world-class education system, offering cutting-edge programs 
                          and research opportunities that prepare students for global careers.
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mr-4">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900">Top Universities</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          Home to prestigious institutions that consistently rank among the world&apos;s best, 
                          providing students with access to exceptional faculty and state-of-the-art facilities.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900">International Community</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          A welcoming environment for international students with diverse cultures, 
                          making it easy to adapt and thrive in your new academic home.
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mr-4">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900">Career Opportunities</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          Strong industry connections and post-graduation work opportunities 
                          that help launch successful careers in various fields.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-brand-50 to-brand-100 rounded-2xl p-8 border border-brand-200">
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Why Choose {destination.country}?</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-600 mb-2">95%</div>
                          <div className="text-sm text-gray-600">Graduate Employment Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-600 mb-2">Top 100</div>
                          <div className="text-sm text-gray-600">Global University Rankings</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-600 mb-2">50+</div>
                          <div className="text-sm text-gray-600">Countries Represented</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-600 mb-2">24/7</div>
                          <div className="text-sm text-gray-600">Student Support</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Enhanced Top Universities Section */}
      <section className="py-20 bg-gradient-to-br from-brand-50/50 via-white to-brand-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(227,6,19,0.08),transparent_50%)] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl mb-6">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
                Top Universities
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore world-renowned institutions offering excellent academic programs and cutting-edge research opportunities in {destination.country}.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(destination.universities) && destination.universities.length > 0 ? (
              destination.universities.map((university: { name: string; image?: string; ranking?: string; location?: string; courses?: string[] }, index: number) => (
                <Reveal key={university.name || index} delay={0.1 * (index + 1)}>
                  <div className="group bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/50">
                    <div className="relative h-56 overflow-hidden">
                      <UniversityImage
                        src={university.image || "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80"}
                        alt={`${university.name} campus`}
                        className="group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                      {university.ranking && (
                        <div className="absolute top-4 right-4 z-20">
                          <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-bold text-brand-600 shadow-lg border border-white/50">
                            {university.ranking}
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 z-20">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                          <Star className="w-4 h-4 text-yellow-400 inline mr-1" />
                          <span className="text-white text-sm font-medium">Top Rated</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors duration-300">{university.name}</h3>
                      {university.location && (
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-brand-500" />
                          <span>{university.location}</span>
                        </div>
                      )}
                      {university.courses && Array.isArray(university.courses) && (
                        <div className="flex flex-wrap gap-2">
                          {university.courses.slice(0, 3).map((course: string, courseIndex: number) => (
                            <span key={courseIndex} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-brand-50 to-brand-100 text-brand-700 border border-brand-200 hover:from-brand-100 hover:to-brand-200 transition-all duration-300">
                              {course}
                            </span>
                          ))}
                          {university.courses.length > 3 && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              +{university.courses.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/50">
                  <div className="text-gray-500 text-lg mb-6">
                    <GraduationCap className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">No universities data available</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      University information for {destination.country} will be displayed here once available. 
                      Contact us for the latest university listings and program details.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Costs & Scholarships */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(227,6,19,0.03),transparent_50%)] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
                Costs & Scholarships
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Plan your education investment with transparent cost information and explore available funding opportunities
              </p>
            </div>
          </Reveal>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Enhanced Costs */}
            <Reveal>
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Study Costs</h3>
                </div>
                {costsMD ? (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mr-4">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Tuition Fees</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Tuition fees vary depending on the university, program level, and field of study. 
                        Most universities offer competitive rates for international students.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 text-center">
                          <div className="text-lg font-bold text-emerald-600">$15,000 - $35,000</div>
                          <div className="text-sm text-gray-600">Undergraduate Programs</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center">
                          <div className="text-lg font-bold text-emerald-600">$20,000 - $45,000</div>
                          <div className="text-sm text-gray-600">Graduate Programs</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Living Expenses</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Living costs include accommodation, food, transportation, and personal expenses. 
                        These vary significantly based on location and lifestyle choices.
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl p-4 text-center">
                          <div className="text-lg font-bold text-blue-600">$800 - $1,500</div>
                          <div className="text-sm text-gray-600">Monthly Rent</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center">
                          <div className="text-lg font-bold text-blue-600">$300 - $600</div>
                          <div className="text-sm text-gray-600">Monthly Food</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center">
                          <div className="text-lg font-bold text-blue-600">$200 - $400</div>
                          <div className="text-sm text-gray-600">Transportation</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mr-4">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Additional Costs</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Health Insurance</span>
                            <span className="font-semibold text-gray-900">$500 - $1,200/year</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Books & Supplies</span>
                            <span className="font-semibold text-gray-900">$800 - $1,500/year</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Visa Application</span>
                            <span className="font-semibold text-gray-900">$150 - $300</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">IELTS/TOEFL</span>
                            <span className="font-semibold text-gray-900">$200 - $250</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Average Annual Cost</span>
                        <span className="font-bold text-emerald-600 text-xl">{destination.averageCost}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="text-sm text-gray-500 mb-1">Tuition Fees</div>
                        <div className="font-semibold text-gray-900">Varies by program</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="text-sm text-gray-500 mb-1">Living Expenses</div>
                        <div className="font-semibold text-gray-900">Included in total</div>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="text-sm text-blue-800">
                        <strong>Note:</strong> Costs may vary depending on the university, program, and location. 
                        Contact us for detailed cost breakdowns for specific programs.
                      </div>
                    </div>
                </div>
                )}
              </div>
            </Reveal>

            {/* Enhanced Scholarships */}
            <Reveal delay={0.2}>
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Scholarships</h3>
                </div>
                {scholarshipsMD ? (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mr-4">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Merit-Based Scholarships</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Awarded based on academic excellence, leadership qualities, and extracurricular achievements. 
                        These scholarships recognize outstanding students and provide significant financial support.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 text-center">
                          <div className="text-lg font-bold text-amber-600">Up to 100%</div>
                          <div className="text-sm text-gray-600">Tuition Coverage</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center">
                          <div className="text-lg font-bold text-amber-600">$5,000 - $25,000</div>
                          <div className="text-sm text-gray-600">Annual Stipend</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Need-Based Financial Aid</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Designed to support students who demonstrate financial need. 
                        These programs ensure that financial constraints don&apos;t prevent qualified students from pursuing their education.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 text-center">
                          <div className="text-lg font-bold text-blue-600">25% - 75%</div>
                          <div className="text-sm text-gray-600">Tuition Reduction</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center">
                          <div className="text-lg font-bold text-blue-600">$2,000 - $15,000</div>
                          <div className="text-sm text-gray-600">Annual Support</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Research Assistantships</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Available for graduate students to work on research projects while studying. 
                        These positions provide valuable experience and financial support.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 text-center">
                          <div className="text-lg font-bold text-purple-600">Full Tuition</div>
                          <div className="text-sm text-gray-600">Waiver + Stipend</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center">
                          <div className="text-lg font-bold text-purple-600">$1,500 - $3,000</div>
                          <div className="text-sm text-gray-600">Monthly Stipend</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mr-4">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Government Scholarships</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        National and international government-sponsored scholarship programs 
                        that support students from specific countries or regions.
                      </p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Fulbright Program</span>
                          <span className="font-semibold text-gray-900">Full Coverage</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Chevening Scholarship</span>
                          <span className="font-semibold text-gray-900">Full Coverage</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Commonwealth Scholarship</span>
                          <span className="font-semibold text-gray-900">Full Coverage</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                      <div className="flex items-center mb-3">
                        <Star className="w-5 h-5 text-amber-600 mr-2" />
                        <div className="font-bold text-gray-900">Merit-based Scholarships</div>
                      </div>
                      <div className="text-lg text-amber-600 font-bold mb-2">Up to 100% tuition coverage</div>
                      <div className="text-sm text-gray-600">For outstanding academic performance and achievements</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center mb-3">
                        <Heart className="w-5 h-5 text-blue-600 mr-2" />
                        <div className="font-bold text-gray-900">Need-based Financial Aid</div>
                      </div>
                      <div className="text-lg text-blue-600 font-bold mb-2">Flexible amounts</div>
                      <div className="text-sm text-gray-600">Based on demonstrated financial need and circumstances</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center mb-3">
                        <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                        <div className="font-bold text-gray-900">Research Assistantships</div>
                      </div>
                      <div className="text-lg text-purple-600 font-bold mb-2">Stipend + Tuition waiver</div>
                      <div className="text-sm text-gray-600">Available for graduate students in research programs</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="text-sm text-gray-700">
                        <strong>Get personalized guidance:</strong> Contact us to learn about specific scholarship opportunities 
                        for your chosen program and eligibility requirements.
                      </div>
                    </div>
                </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Enhanced Visa Information */}
      <section className="py-20 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
                Visa Information
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Everything you need to know about student visa requirements, work rights, and application process for {destination.country}.
              </p>
            </div>
          </Reveal>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 max-w-6xl mx-auto">
            {visaMD ? (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Student Visa Information</h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
                </div>
                
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Visa Types</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4">
                          <div className="font-semibold text-gray-900 mb-2">Student Visa (F-1)</div>
                          <div className="text-sm text-gray-600">For full-time academic studies at accredited institutions</div>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                          <div className="font-semibold text-gray-900 mb-2">Exchange Visitor Visa (J-1)</div>
                          <div className="text-sm text-gray-600">For students participating in exchange programs</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mr-4">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Processing Timeline</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Application Submission</span>
                          <span className="font-semibold text-gray-900">1-2 weeks</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Document Review</span>
                          <span className="font-semibold text-gray-900">2-4 weeks</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Interview Scheduling</span>
                          <span className="font-semibold text-gray-900">1-3 weeks</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Final Processing</span>
                          <span className="font-semibold text-gray-900">1-2 weeks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Required Documents</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">I-20 Form</div>
                            <div className="text-sm text-gray-600">Certificate of Eligibility from your university</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Financial Documentation</div>
                            <div className="text-sm text-gray-600">Bank statements showing sufficient funds</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Academic Records</div>
                            <div className="text-sm text-gray-600">Transcripts and diplomas from previous education</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">English Proficiency</div>
                            <div className="text-sm text-gray-600">IELTS, TOEFL, or equivalent test scores</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mr-4">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Work Rights</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white rounded-xl p-4">
                          <div className="font-semibold text-gray-900 mb-1">On-Campus Employment</div>
                          <div className="text-sm text-gray-600">Up to 20 hours per week during academic terms</div>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                          <div className="font-semibold text-gray-900 mb-1">Optional Practical Training (OPT)</div>
                          <div className="text-sm text-gray-600">12 months of work authorization after graduation</div>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                          <div className="font-semibold text-gray-900 mb-1">Curricular Practical Training (CPT)</div>
                          <div className="text-sm text-gray-600">Work experience related to your field of study</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Visa Details</h3>
                </div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Work Rights</span>
                      <span className="font-bold text-blue-600 text-lg">{destination.workRights}</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Processing Time</span>
                      <span className="font-bold text-emerald-600 text-lg">4-8 weeks</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Visa Type</span>
                      <span className="font-bold text-purple-600 text-lg">Student Visa</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Requirements</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">University acceptance letter</div>
                        <div className="text-sm text-gray-600">Official admission confirmation from your chosen institution</div>
                      </div>
                    </div>
                    <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">Financial documentation</div>
                        <div className="text-sm text-gray-600">Proof of sufficient funds for tuition and living expenses</div>
                      </div>
                    </div>
                    <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">English proficiency test</div>
                        <div className="text-sm text-gray-600">IELTS, TOEFL, or equivalent language certification</div>
                      </div>
                    </div>
                    <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">Health insurance</div>
                        <div className="text-sm text-gray-600">Comprehensive medical coverage for your stay</div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Intakes */}
      <section className="py-20 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
                Academic Intakes
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Plan your application timeline with available intake periods and important deadlines for {destination.country}.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {intakesMD ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 max-w-6xl mx-auto col-span-3">
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Academic Intake Schedule</h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full"></div>
                  </div>
                  
                  <div className="grid gap-8 md:grid-cols-3">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Fall Intake</h4>
                        <div className="text-emerald-600 font-bold text-lg">August - September</div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4">
                          <div className="text-sm text-gray-600 mb-1">Application Deadline</div>
                          <div className="font-semibold text-gray-900">December - February</div>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                          <div className="text-sm text-gray-600 mb-1">Document Submission</div>
                          <div className="font-semibold text-gray-900">March - April</div>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                          <div className="text-sm text-gray-600 mb-1">Visa Application</div>
                          <div className="font-semibold text-gray-900">May - June</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Spring Intake</h4>
                        <div className="text-blue-600 font-bold text-lg">January - February</div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4">
                          <div className="text-sm text-gray-600 mb-1">Application Deadline</div>
                          <div className="font-semibold text-gray-900">September - October</div>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                          <div className="text-sm text-gray-600 mb-1">Document Submission</div>
                          <div className="font-semibold text-gray-900">October - November</div>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                          <div className="text-sm text-gray-600 mb-1">Visa Application</div>
                          <div className="font-semibold text-gray-900">November - December</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Summer Intake</h4>
                        <div className="text-purple-600 font-bold text-lg">May - June</div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4">
                          <div className="text-sm text-gray-600 mb-1">Application Deadline</div>
                          <div className="font-semibold text-gray-900">February - March</div>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                          <div className="text-sm text-gray-600 mb-1">Document Submission</div>
                          <div className="font-semibold text-gray-900">March - April</div>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                          <div className="text-sm text-gray-600 mb-1">Visa Application</div>
                          <div className="font-semibold text-gray-900">April - May</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-900 mb-6">Important Application Tips</h4>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 mb-1">Early Application</div>
                              <div className="text-sm text-gray-600">Apply 6-12 months before your intended start date</div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 mb-1">Document Preparation</div>
                              <div className="text-sm text-gray-600">Ensure all documents are properly translated and certified</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 mb-1">Language Requirements</div>
                              <div className="text-sm text-gray-600">Complete IELTS/TOEFL tests well in advance</div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 mb-1">Financial Planning</div>
                              <div className="text-sm text-gray-600">Prepare financial documents showing sufficient funds</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Reveal delay={0.1}>
                  <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Fall Intake</h3>
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-4 mb-4 border border-emerald-200">
                      <div className="text-emerald-600 font-bold text-lg mb-1">August - September</div>
                      <div className="text-sm text-emerald-700">Semester Start</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Application Deadline:</strong>
                      </div>
                      <div className="text-gray-800 font-medium">December - February</div>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Spring Intake</h3>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 mb-4 border border-blue-200">
                      <div className="text-blue-600 font-bold text-lg mb-1">January - February</div>
                      <div className="text-sm text-blue-700">Semester Start</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Application Deadline:</strong>
                      </div>
                      <div className="text-gray-800 font-medium">September - October</div>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Summer Intake</h3>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 mb-4 border border-purple-200">
                      <div className="text-purple-600 font-bold text-lg mb-1">May - June</div>
                      <div className="text-sm text-purple-700">Semester Start</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Application Deadline:</strong>
                      </div>
                      <div className="text-gray-800 font-medium">February - March</div>
                    </div>
                  </div>
                </Reveal>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Popular Courses */}
      {destination.popularCourses && destination.popularCourses.length > 0 && (
      <section className="py-20 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.05),transparent_50%)] pointer-events-none"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <Reveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
                  Popular Courses
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Explore the most sought-after academic programs and career-focused degrees in {destination.country}.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {destination.popularCourses?.map((course: string, index: number) => (
                  <div key={index} className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">{course}</h3>
                  </div>
                )) || (
                  <div className="col-span-full text-center py-16">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/50">
                      <BookOpen className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                      <h3 className="text-2xl font-bold text-gray-700 mb-4">No popular courses available</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Course information for {destination.country} will be displayed here once available.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Enhanced Lifestyle & Culture */}
      <section className="py-20 bg-gradient-to-br from-rose-50/50 via-white to-orange-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,113,133,0.05),transparent_50%)] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
                Student Life & Culture
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Experience the unique lifestyle and cultural opportunities that await you in {destination.country}. 
                Discover what makes it an exceptional place to live and study.
              </p>
            </div>
          </Reveal>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="group text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-rose-600 transition-colors duration-300">Quality of Life</h3>
                <p className="text-gray-600 leading-relaxed">High standard of living with excellent healthcare, modern infrastructure, and world-class amenities</p>
              </div>
              <div className="group text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">Safety & Security</h3>
                <p className="text-gray-600 leading-relaxed">Generally very safe with low crime rates and strong law enforcement ensuring student safety</p>
              </div>
              <div className="group text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">Cultural Diversity</h3>
                <p className="text-gray-600 leading-relaxed">Diverse, multicultural environment with rich traditions and welcoming international community</p>
              </div>
              <div className="group text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">Popular Cities</h3>
                <p className="text-gray-600 leading-relaxed">{destination.popularCities?.join(", ") || 'Major cities available'} - each offering unique experiences and opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQs */}
      {faqs && faqs.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-indigo-50/50 via-white to-cyan-50/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.05),transparent_50%)] pointer-events-none"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <Reveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Get answers to common questions about studying in {destination.country}. 
                  Find everything you need to know about your study abroad journey.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="max-w-5xl mx-auto space-y-6">
                {faqs.map((faq: { question: string; answer: string }, index: number) => (
                  <div key={index} className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">{faq.question}</h3>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Enhanced Call to Action */}
      <section className="py-20 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center relative">
          <Reveal>
            <div className="text-8xl mb-8 transform hover:scale-110 transition-transform duration-300">{destination.flag}</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Study in {destination.country}?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              Get personalized guidance for your {destination.country} education journey. 
              Our expert consultants are here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a 
                href="/book-consultation" 
                className="group bg-white text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                <Calendar className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Book Free Consultation
              </a>
              <a 
                href="/contact" 
                className="group border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm hover:shadow-2xl transform hover:-translate-y-1"
              >
                <ArrowRight className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                Get Expert Guidance
              </a>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-white font-semibold mb-2">Expert Guidance</div>
                <div className="text-white/80 text-sm">Professional consultants with years of experience</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-white font-semibold mb-2">100% Success Rate</div>
                <div className="text-white/80 text-sm">Proven track record of successful applications</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="text-white font-semibold mb-2">Personalized Support</div>
                <div className="text-white/80 text-sm">Tailored assistance for your unique needs</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
