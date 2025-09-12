import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import LazyImage from "@/components/ui/lazy-image";
import { Users, GraduationCap, Globe, Star, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Study Destinations | Flyover Consultancy",
  description: "Explore top study destinations including Australia, Canada, USA, UK, Europe, New Zealand, and Japan. Find universities, costs, visas, and more.",
};

const countries = [
  {
    slug: "australia",
    name: "Australia",
    flag: "🇦🇺",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "World-class universities with post-study work opportunities and vibrant student life.",
    highlights: ["Post-study work visa", "High quality of life", "Research opportunities"],
    universities: "43 Universities",
    students: "700,000+ International Students",
    popularCities: ["Sydney", "Melbourne", "Brisbane"],
    averageCost: "$20,000 - $45,000 AUD",
    workRights: "20 hrs/week",
    color: "from-green-400 to-blue-500"
  },
  {
    slug: "canada",
    name: "Canada",
    flag: "🇨🇦",
    image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "High-quality education with welcoming immigration pathways and multicultural environment.",
    highlights: ["Immigration pathways", "Affordable tuition", "Safe environment"],
    universities: "98 Universities",
    students: "640,000+ International Students",
    popularCities: ["Toronto", "Vancouver", "Montreal"],
    averageCost: "$13,000 - $35,000 CAD",
    workRights: "20 hrs/week",
    color: "from-red-400 to-red-600"
  },
  {
    slug: "usa",
    name: "United States",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "Top-ranked universities with extensive research opportunities and diverse academic programs.",
    highlights: ["World's top universities", "Research funding", "Diverse programs"],
    universities: "4,000+ Universities",
    students: "1.1M+ International Students",
    popularCities: ["New York", "Los Angeles", "Boston"],
    averageCost: "$25,000 - $55,000 USD",
    workRights: "On-campus only",
    color: "from-blue-400 to-blue-600"
  },
  {
    slug: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "Historic institutions offering 1-year master's programs with rich academic heritage.",
    highlights: ["1-year master's", "Historic universities", "Cultural diversity"],
    universities: "130+ Universities",
    students: "485,000+ International Students",
    popularCities: ["London", "Manchester", "Edinburgh"],
    averageCost: "£15,000 - £35,000 GBP",
    workRights: "20 hrs/week",
    color: "from-purple-400 to-indigo-600"
  },
  {
    slug: "europe",
    name: "Europe",
    flag: "🇪🇺",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "Schengen access with varied tuition options and rich cultural experiences across multiple countries.",
    highlights: ["Schengen mobility", "Low tuition fees", "Cultural diversity"],
    universities: "4,000+ Universities",
    students: "2M+ International Students",
    popularCities: ["Berlin", "Amsterdam", "Paris"],
    averageCost: "€5,000 - €20,000 EUR",
    workRights: "Varies by country",
    color: "from-yellow-400 to-orange-500"
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    flag: "🇳🇿",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "Safe, beautiful country with innovation-focused education and excellent quality of life.",
    highlights: ["Safe environment", "Innovation focus", "Natural beauty"],
    universities: "8 Universities",
    students: "50,000+ International Students",
    popularCities: ["Auckland", "Wellington", "Christchurch"],
    averageCost: "$22,000 - $32,000 NZD",
    workRights: "20 hrs/week",
    color: "from-teal-400 to-cyan-500"
  },
  {
    slug: "japan",
    name: "Japan",
    flag: "🇯🇵",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "Technology-forward education with unique culture, excellent scholarships, and innovation opportunities.",
    highlights: ["Technology focus", "MEXT scholarships", "Cultural experience"],
    universities: "780+ Universities",
    students: "280,000+ International Students",
    popularCities: ["Tokyo", "Osaka", "Kyoto"],
    averageCost: "¥500,000 - ¥1,500,000 JPY",
    workRights: "28 hrs/week",
    color: "from-pink-400 to-rose-500"
  }
];

const stats = [
  { icon: Globe, label: "Countries", value: "50+" },
  { icon: GraduationCap, label: "Partner Universities", value: "500+" },
  { icon: Users, label: "Students Placed", value: "22,000+" },
  { icon: Star, label: "Success Rate", value: "98%" }
];

export default function DestinationsPage() {
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
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {countries.map((country, index) => (
              <Reveal key={country.slug} delay={index * 0.1}>
                <Link 
                  href={`/destinations/${country.slug}`} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-[650px] flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <LazyImage
                      src={country.image}
                      alt={`Study in ${country.name}`}
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
                    <h3 className="text-2xl font-bold mb-2">{country.name}</h3>
                    <p className="text-white/90 text-sm leading-relaxed line-clamp-3">{country.description}</p>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Universities</div>
                        <div className="font-semibold text-gray-900 text-sm">{country.universities}</div>
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
                        {country.highlights.map((highlight, idx) => (
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
