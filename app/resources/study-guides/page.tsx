import type { Metadata } from "next";
import { BookOpenIcon, GlobeIcon, ClockIcon, StarIcon, DownloadIcon, ArrowRightIcon, GraduationCapIcon, MapPinIcon, DollarSignIcon, CalendarIcon } from "lucide-react";
import PageHeader from "@/components/page-header";
import Reveal from "@/components/ui/reveal";
import CtaButton from "@/components/cta-button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Study Guides | Flyover Consultancy",
  description: "Comprehensive guides for studying abroad including country-specific information, application processes, and preparation tips.",
};

const studyGuides = [
  {
    id: "usa",
    title: "Study in USA",
    description: "Complete guide to studying in the United States including top universities, application process, and visa requirements.",
    image: "/flags/usa.svg",
    readTime: "15 min read",
    downloads: "2.3k",
    rating: 4.9,
    topics: ["Universities", "Student Visa", "Scholarships", "Living Costs"],
    highlights: {
      universities: "4,000+",
      avgCost: "$30,000-60,000/year",
      visaTime: "2-8 weeks",
      workHours: "20 hrs/week"
    }
  },
  {
    id: "canada",
    title: "Study in Canada",
    description: "Your pathway to Canadian education with information on programs, immigration, and post-graduation opportunities.",
    image: "/flags/canada.svg",
    readTime: "12 min read",
    downloads: "1.8k",
    rating: 4.8,
    topics: ["Programs", "Immigration", "Work Permits", "PR Pathway"],
    highlights: {
      universities: "200+",
      avgCost: "$25,000-45,000/year",
      visaTime: "4-12 weeks",
      workHours: "20 hrs/week"
    }
  },
  {
    id: "uk",
    title: "Study in UK",
    description: "Explore British higher education system, Russell Group universities, and post-study work opportunities.",
    image: "/flags/uk.svg",
    readTime: "10 min read",
    downloads: "1.5k",
    rating: 4.7,
    topics: ["Russell Group", "UCAS", "Graduate Route", "Scholarships"],
    highlights: {
      universities: "130+",
      avgCost: "£15,000-35,000/year",
      visaTime: "3-6 weeks",
      workHours: "20 hrs/week"
    }
  },
  {
    id: "australia",
    title: "Study in Australia",
    description: "Discover Australian universities, student life, and pathways to permanent residency through education.",
    image: "/flags/australia.svg",
    readTime: "13 min read",
    downloads: "1.2k",
    rating: 4.8,
    topics: ["Group of Eight", "Student Visa", "PR Points", "Living Guide"],
    highlights: {
      universities: "40+",
      avgCost: "AUD 25,000-50,000/year",
      visaTime: "4-8 weeks",
      workHours: "24 hrs/week"
    }
  },
  {
    id: "germany",
    title: "Study in Germany",
    description: "Learn about German higher education, low-cost programs, and opportunities in Europe's economic powerhouse.",
    image: "/flags/germany.svg",
    readTime: "11 min read",
    downloads: "900",
    rating: 4.6,
    topics: ["Public Universities", "Language Requirements", "EU Benefits", "Job Market"],
    highlights: {
      universities: "400+",
      avgCost: "€500-3,000/year",
      visaTime: "6-12 weeks",
      workHours: "20 hrs/week"
    }
  },
  {
    id: "new-zealand",
    title: "Study in New Zealand",
    description: "Explore New Zealand's education system, beautiful campuses, and post-study work opportunities.",
    image: "/flags/nz.svg",
    readTime: "9 min read",
    downloads: "750",
    rating: 4.7,
    topics: ["Universities", "Student Visa", "Work Rights", "PR Pathway"],
    highlights: {
      universities: "8+",
      avgCost: "NZD 22,000-35,000/year",
      visaTime: "4-6 weeks",
      workHours: "20 hrs/week"
    }
  }
];

const generalGuides = [
  {
    title: "Complete Application Checklist",
    description: "Step-by-step checklist to ensure your application is complete and competitive.",
    icon: BookOpenIcon,
    readTime: "8 min read",
    category: "Applications"
  },
  {
    title: "IELTS vs TOEFL: Which to Choose?",
    description: "Comprehensive comparison to help you decide which English test is right for you.",
    icon: GlobeIcon,
    readTime: "6 min read",
    category: "Tests"
  },
  {
    title: "Scholarship Application Guide",
    description: "How to find and apply for scholarships to fund your international education.",
    icon: DollarSignIcon,
    readTime: "12 min read",
    category: "Funding"
  },
  {
    title: "Pre-Departure Preparation",
    description: "Everything you need to know before leaving for your study abroad journey.",
    icon: CalendarIcon,
    readTime: "10 min read",
    category: "Preparation"
  }
];

export default function StudyGuidesPage() {
  return (
    <div>
      <PageHeader
        title="Study Guides"
        subtitle="Comprehensive guides to help you navigate your study abroad journey"
        image="/hero/slide3.svg"
      />
      
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Overview Section */}
        <Reveal>
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Know</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive study guides cover every aspect of studying abroad, from choosing the right country 
              to settling in your new home. Download our guides and start your journey today.
            </p>
          </div>
        </Reveal>

        {/* Country-Specific Guides */}
        <div className="mb-20">
          <Reveal>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <MapPinIcon className="h-6 w-6 text-blue-600" />
              Country-Specific Guides
            </h3>
          </Reveal>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {studyGuides.map((guide, index) => (
              <Reveal key={guide.id} delay={index * 0.1}>
                <div className="group rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <GlobeIcon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{guide.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4" />
                          <span>{guide.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-yellow-600">
                      <StarIcon className="h-4 w-4 fill-current" />
                      <span>{guide.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{guide.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="font-medium text-blue-900">Universities</div>
                      <div className="text-blue-700">{guide.highlights.universities}</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <div className="font-medium text-green-900">Avg. Cost</div>
                      <div className="text-green-700">{guide.highlights.avgCost}</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <div className="font-medium text-purple-900">Visa Time</div>
                      <div className="text-purple-700">{guide.highlights.visaTime}</div>
                    </div>
                    <div className="bg-orange-50 p-2 rounded">
                      <div className="font-medium text-orange-900">Work Hours</div>
                      <div className="text-orange-700">{guide.highlights.workHours}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {guide.topics.slice(0, 3).map((topic) => (
                      <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <DownloadIcon className="h-4 w-4" />
                      <span>{guide.downloads} downloads</span>
                    </div>
                    <Link href={`/resources/study-guides/${guide.id}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium group-hover:gap-2 transition-all">
                      Read Guide
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* General Guides */}
        <div className="mb-16">
          <Reveal>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
              General Study Abroad Guides
            </h3>
          </Reveal>
          
          <div className="grid gap-6 md:grid-cols-2">
            {generalGuides.map((guide, index) => {
              const IconComponent = guide.icon;
              return (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="group rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-blue-50 p-3">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{guide.category}</span>
                          <span className="text-sm text-gray-500">{guide.readTime}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{guide.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                        <Link href={`#`} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium group-hover:gap-2 transition-all">
                          Read Guide
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Reveal delay={0.4}>
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
            <GraduationCapIcon className="h-12 w-12 mx-auto mb-4 text-blue-200" />
            <h3 className="text-2xl font-bold mb-4">Need Personalized Guidance?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              While our guides provide comprehensive information, every student&apos;s journey is unique. 
              Get personalized advice from our expert counselors.
            </p>
            <CtaButton href="/contact" className="bg-white text-blue-600 hover:bg-gray-100">
              Book Free Consultation
            </CtaButton>
          </div>
        </Reveal>
      </div>
    </div>
  );
}