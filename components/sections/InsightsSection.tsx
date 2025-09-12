"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";

const insights = [
  {
    id: 1,
    category: "University Rankings",
    categoryColor: "bg-blue-100 text-blue-800",
    author: "Dr. Sarah Mitchell",
    authorRole: "Education Consultant",
    readTime: "8 min read",
    publishDate: "Dec 15, 2024",
    title: "Top 10 Universities in Canada for International Students 2025",
    excerpt: "Comprehensive analysis of Canada's leading universities, including admission requirements, tuition fees, and scholarship opportunities for international students.",
    image: (
      <div className="w-full h-48 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center text-white text-4xl font-bold">
        🇨🇦
      </div>
    ),
    featured: true,
    views: "12.5K",
    likes: "892"
  },
  {
    id: 2,
    category: "Visa Guide",
    categoryColor: "bg-green-100 text-green-800",
    author: "Ahmed Hassan",
    authorRole: "Immigration Lawyer",
    readTime: "12 min read",
    publishDate: "Dec 12, 2024",
    title: "Complete Student Visa Application Guide 2025: Step-by-Step Process",
    excerpt: "Everything you need to know about student visa applications, including required documents, processing times, and common mistakes to avoid.",
    image: (
      <div className="w-full h-48 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center text-white text-4xl font-bold">
        📋
      </div>
    ),
    featured: false,
    views: "8.7K",
    likes: "654"
  },
  {
    id: 3,
    category: "Scholarships",
    categoryColor: "bg-purple-100 text-purple-800",
    author: "Maria Rodriguez",
    authorRole: "Financial Aid Advisor",
    readTime: "6 min read",
    publishDate: "Dec 10, 2024",
    title: "$2M+ in Scholarships: Opportunities You Can't Afford to Miss",
    excerpt: "Discover merit-based, need-based, and country-specific scholarships available for international students in 2025.",
    image: (
      <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-lg flex items-center justify-center text-white text-4xl font-bold">
        💰
      </div>
    ),
    featured: false,
    views: "15.2K",
    likes: "1.1K"
  },
  {
    id: 4,
    category: "Cost of Living",
    categoryColor: "bg-orange-100 text-orange-800",
    author: "James Thompson",
    authorRole: "Student Life Coordinator",
    readTime: "10 min read",
    publishDate: "Dec 8, 2024",
    title: "Living Costs Breakdown: UK vs USA vs Canada vs Australia",
    excerpt: "Detailed comparison of living expenses, accommodation costs, and budgeting tips for popular study destinations.",
    image: (
      <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white text-4xl font-bold">
        🏠
      </div>
    ),
    featured: false,
    views: "9.8K",
    likes: "743"
  },
  {
    id: 5,
    category: "Career Guidance",
    categoryColor: "bg-cyan-100 text-cyan-800",
    author: "Lisa Chen",
    authorRole: "Career Development Specialist",
    readTime: "7 min read",
    publishDate: "Dec 5, 2024",
    title: "Post-Graduation Work Permits: Your Path to International Career",
    excerpt: "Navigate post-study work opportunities, visa extensions, and career prospects in different countries after graduation.",
    image: (
      <div className="w-full h-48 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-4xl font-bold">
        🎓
      </div>
    ),
    featured: false,
    views: "6.4K",
    likes: "521"
  },
  {
    id: 6,
    category: "Test Preparation",
    categoryColor: "bg-pink-100 text-pink-800",
    author: "Robert Kim",
    authorRole: "IELTS/TOEFL Expert",
    readTime: "9 min read",
    publishDate: "Dec 3, 2024",
    title: "IELTS vs TOEFL: Which Test Should You Take in 2025?",
    excerpt: "Comprehensive comparison of English proficiency tests, preparation strategies, and university acceptance criteria.",
    image: (
      <div className="w-full h-48 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg flex items-center justify-center text-white text-4xl font-bold">
        📚
      </div>
    ),
    featured: false,
    views: "11.3K",
    likes: "867"
  }
];

const categories = [
  { name: "All", count: insights.length },
  { name: "University Rankings", count: insights.filter(i => i.category === "University Rankings").length },
  { name: "Visa Guide", count: insights.filter(i => i.category === "Visa Guide").length },
  { name: "Scholarships", count: insights.filter(i => i.category === "Scholarships").length },
  { name: "Cost of Living", count: insights.filter(i => i.category === "Cost of Living").length },
  { name: "Career Guidance", count: insights.filter(i => i.category === "Career Guidance").length }
];

export default function InsightsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const filteredInsights = activeCategory === "All" 
    ? insights 
    : insights.filter(insight => insight.category === activeCategory);

  const featuredInsight = insights.find(insight => insight.featured);
  const regularInsights = insights.filter(insight => !insight.featured);

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">Insights</span> to Keep You Ahead
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Stay informed with expert advice, latest trends, and actionable insights to make your study abroad journey successful.
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.slice(0, 6).map((category, index) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.name
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {featuredInsight && activeCategory === "All" && (
          <div className={`mb-16 transform transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${featuredInsight.categoryColor}`}>
                      {featuredInsight.category}
                    </span>
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold">
                      ⭐ FEATURED
                    </span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {featuredInsight.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    {featuredInsight.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {featuredInsight.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{featuredInsight.author}</div>
                        <div className="text-sm text-gray-500">{featuredInsight.authorRole}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {featuredInsight.publishDate} • {featuredInsight.readTime}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <span>👁️</span>
                        <span>{featuredInsight.views}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>❤️</span>
                        <span>{featuredInsight.likes}</span>
                      </span>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      Read Article
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  {featuredInsight.image}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(activeCategory === "All" ? regularInsights : filteredInsights).map((insight, index) => (
            <article
              key={insight.id}
              className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${index * 150}ms`
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                {insight.image}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${insight.categoryColor}`}>
                    {insight.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors duration-200">
                    →
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-500">
                    {insight.publishDate}
                  </div>
                  <div className="text-sm text-gray-500">
                    {insight.readTime}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-red-700 transition-all duration-300">
                  {insight.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {insight.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {insight.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{insight.author}</div>
                      <div className="text-xs text-gray-500">{insight.authorRole}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <span>👁️</span>
                      <span>{insight.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>❤️</span>
                      <span>{insight.likes}</span>
                    </span>
                  </div>
                </div>

                {/* Hover Effect */}
                {hoveredIndex === index && (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/5 rounded-2xl" />
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated with Latest Insights
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and get expert advice, university updates, and scholarship opportunities delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Subscribe
              </button>
            </div>
            <div className="mt-4">
              <Link href="/resources" className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-200">
                View All Articles →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}