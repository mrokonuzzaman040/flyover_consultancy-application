import type { Metadata } from "next";
import { BookOpenIcon, FileTextIcon, HelpCircleIcon, SearchIcon, FilterIcon, CalendarIcon, TrendingUpIcon, UsersIcon, ArrowRightIcon } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import CtaButton from "@/components/cta-button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources | Flyover Consultancy",
  description: "Comprehensive guides, tips, and resources for studying abroad including country guides, application tips, and FAQs.",
};

const resourceCategories = [
  {
    title: "Study Guides",
    description: "Comprehensive country-specific guides covering universities, costs, visa requirements, and more.",
    href: "/resources/study-guides",
    icon: BookOpenIcon,
    color: "bg-blue-50 text-blue-600",
    stats: "25+ Guides",
    popular: true
  },
  {
    title: "Application Tips",
    description: "Expert strategies and tips to create winning applications and maximize your admission chances.",
    href: "/resources/application-tips",
    icon: FileTextIcon,
    color: "bg-green-50 text-green-600",
    stats: "50+ Tips",
    popular: true
  },
  {
    title: "FAQ",
    description: "Answers to frequently asked questions about studying abroad, visas, and our services.",
    href: "/resources/faq",
    icon: HelpCircleIcon,
    color: "bg-purple-50 text-purple-600",
    stats: "100+ Questions",
    popular: false
  }
];

const recentArticles = [
  {
    title: "Top 10 Universities in Canada for International Students",
    excerpt: "Discover the best Canadian universities offering world-class education and excellent post-graduation opportunities.",
    author: "Sarah Johnson",
    readTime: "8 min read",
    date: "Jan 15, 2025",
    category: "Study Guides",
    image: "/articles/canada-universities.jpg"
  },
  {
    title: "How to Write a Compelling Personal Statement",
    excerpt: "Learn the secrets to crafting personal statements that capture admissions officers' attention and showcase your unique story.",
    author: "Michael Chen",
    readTime: "12 min read",
    date: "Jan 12, 2025",
    category: "Application Tips",
    image: "/articles/personal-statement.jpg"
  },
  {
    title: "Student Visa Requirements: Complete Checklist",
    excerpt: "Everything you need to know about student visa applications, required documents, and common mistakes to avoid.",
    author: "Emma Wilson",
    readTime: "10 min read",
    date: "Jan 10, 2025",
    category: "Visa Guide",
    image: "/articles/visa-requirements.jpg"
  }
];

export default function ResourcesIndexPage() {
  return (
    <div>
      <PageHeader
        title="Study Abroad Resources"
        subtitle="Everything you need to know about studying abroad - from choosing universities to settling in your new country"
        image="/hero/slide3.svg"
      />
      
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Resource Categories */}
        <div className="mb-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Resources</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Access comprehensive guides, expert tips, and answers to all your study abroad questions.
              </p>
            </div>
          </Reveal>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {resourceCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Reveal key={category.title} delay={index * 0.1}>
                  <Link href={category.href} className="group">
                    <div className="relative rounded-2xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                      {category.popular && (
                        <div className="absolute -top-3 -right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Popular
                        </div>
                      )}
                      <div className={`inline-flex rounded-xl p-3 ${category.color} mb-4`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">{category.stats}</span>
                        <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-16">
          <Reveal>
            <div className="rounded-2xl bg-gray-50 p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Specific Information</h3>
                <p className="text-gray-600">Search our comprehensive database of articles and guides</p>
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input 
                      className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                      placeholder="Search articles, guides..."
                    />
                  </div>
                  <div className="relative">
                    <FilterIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <select className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none">
                      <option value="">All Countries</option>
                      <option>USA</option>
                      <option>Canada</option>
                      <option>UK</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>New Zealand</option>
                    </select>
                  </div>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <select className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none">
                      <option value="">Any Date</option>
                      <option>Last 30 days</option>
                      <option>Last 3 months</option>
                      <option>Last 6 months</option>
                      <option>Last year</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Recent Articles */}
        <div className="mb-16">
          <Reveal>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Latest Articles</h3>
              <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <article className="group rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-80"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.excerpt}</p>
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                      Read Article
                      <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <Reveal delay={0.3}>
          <div className="mb-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Trusted by Students Worldwide</h3>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Our comprehensive resources have helped thousands of students achieve their study abroad dreams.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <TrendingUpIcon className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                <div className="text-2xl font-bold mb-1">500+</div>
                <div className="text-blue-200 text-sm">Articles & Guides</div>
              </div>
              <div className="text-center">
                <UsersIcon className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                <div className="text-2xl font-bold mb-1">50k+</div>
                <div className="text-blue-200 text-sm">Monthly Readers</div>
              </div>
              <div className="text-center">
                <BookOpenIcon className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                <div className="text-2xl font-bold mb-1">25+</div>
                <div className="text-blue-200 text-sm">Country Guides</div>
              </div>
              <div className="text-center">
                <FileTextIcon className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                <div className="text-2xl font-bold mb-1">100+</div>
                <div className="text-blue-200 text-sm">Application Tips</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA Section */}
        <Reveal delay={0.4}>
          <div className="text-center rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Personalized Guidance?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              While our resources provide comprehensive information, every student&apos;s journey is unique. 
              Get expert advice tailored to your specific goals and circumstances.
            </p>
            <CtaButton href="/contact" className="bg-blue-600 text-white hover:bg-blue-700">
              Book Free Consultation
            </CtaButton>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
