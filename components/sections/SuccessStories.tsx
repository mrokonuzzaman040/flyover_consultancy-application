"use client";

import { useState, useEffect } from 'react';
import StarRating from "@/components/ui/star-rating";

const successStories = [
  {
    id: 1,
    rating: 5,
    text: "Flyover Global made my dream of studying at Harvard a reality. Their personalized guidance and scholarship assistance helped me secure a full scholarship. The counselors were incredibly supportive throughout the entire process.",
    author: "Rashida Ahmed",
    university: "Harvard University",
    program: "Master's in Computer Science",
    country: "USA",
    scholarship: "Full Scholarship",
    year: "2024",
    avatar: (
      <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
        RA
      </div>
    ),
    flag: "🇺🇸",
    color: "from-red-500 to-red-700"
  },
  {
    id: 2,
    rating: 5,
    text: "The team at Flyover Global helped me navigate the complex application process for Oxford. Their IELTS preparation sessions were excellent, and I achieved the score I needed. Now I'm pursuing my PhD in Engineering!",
    author: "Mohammad Hassan",
    university: "University of Oxford",
    program: "PhD in Engineering",
    country: "UK",
    scholarship: "Partial Scholarship",
    year: "2023",
    avatar: (
      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
        MH
      </div>
    ),
    flag: "🇬🇧",
    color: "from-blue-600 to-blue-800"
  },
  {
    id: 3,
    rating: 5,
    text: "Thanks to Flyover Global, I'm now studying at the University of Toronto. The visa process was seamless, and their career counseling helped me choose the perfect program. Couldn't be happier with my decision!",
    author: "Fatima Khan",
    university: "University of Toronto",
    program: "Master's in Business Administration",
    country: "Canada",
    scholarship: "Merit Scholarship",
    year: "2024",
    avatar: (
      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
        FK
      </div>
    ),
    flag: "🇨🇦",
    color: "from-green-500 to-green-700"
  },
  {
    id: 4,
    rating: 5,
    text: "Flyover Global's support was incredible from start to finish. They helped me get into the University of Melbourne with a scholarship. The pre-departure orientation was very helpful for my transition to Australia.",
    author: "Arif Rahman",
    university: "University of Melbourne",
    program: "Master's in Data Science",
    country: "Australia",
    scholarship: "International Excellence Scholarship",
    year: "2023",
    avatar: (
      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
        AR
      </div>
    ),
    flag: "🇦🇺",
    color: "from-orange-500 to-orange-700"
  },
  {
    id: 5,
    rating: 5,
    text: "I was overwhelmed by the application process until I found Flyover Global. They simplified everything and helped me secure admission to NUS with financial aid. Their expertise in Asian universities is unmatched.",
    author: "Nusrat Jahan",
    university: "National University of Singapore",
    program: "Master's in Public Policy",
    country: "Singapore",
    scholarship: "Need-based Aid",
    year: "2024",
    avatar: (
      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
        NJ
      </div>
    ),
    flag: "🇸🇬",
    color: "from-purple-500 to-purple-700"
  },
  {
    id: 6,
    rating: 5,
    text: "The personalized attention I received from Flyover Global was amazing. They helped me craft compelling essays and prepare for interviews. Now I'm at Imperial College London pursuing my dream in Artificial Intelligence!",
    author: "Tanvir Ahmed",
    university: "Imperial College London",
    program: "Master's in Artificial Intelligence",
    country: "UK",
    scholarship: "Dean's Excellence Scholarship",
    year: "2023",
    avatar: (
      <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
        TA
      </div>
    ),
    flag: "🇬🇧",
    color: "from-cyan-500 to-cyan-700"
  }
];

export default function SuccessStories() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(successStories.length / 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // const getCurrentStories = () => {
  //   const startIndex = currentSlide * 3;
  //   return successStories.slice(startIndex, startIndex + 3);
  // };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const stats = [
    { number: "22,000+", label: "Success Stories" },
    { number: "95%", label: "Visa Success Rate" },
    { number: "$50M+", label: "Scholarships Secured" },
    { number: "200+", label: "Partner Universities" }
  ];

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">22,000+</span> Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Real students, real achievements. Discover how Flyover Global has transformed dreams into reality for thousands of students worldwide.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center transform transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stories Slider */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(successStories.length / 3) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 px-4">
                    {successStories.slice(slideIndex * 3, slideIndex * 3 + 3).map((story, index) => (
                      <div
                        key={story.id}
                        className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                        style={{
                          transitionDelay: `${index * 150}ms`
                        }}
                        onMouseEnter={() => setHoveredIndex(slideIndex * 3 + index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                        
                        {/* Content */}
                        <div className="relative z-10">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-4">
                              {story.avatar}
                              <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-red-700 transition-all duration-300">
                                  {story.author}
                                </h3>
                                <div className="text-sm text-gray-500">
                                  Class of {story.year}
                                </div>
                              </div>
                            </div>
                            <div className="text-2xl">{story.flag}</div>
                          </div>

                          {/* University Info */}
                          <div className="mb-6 p-4 bg-gray-50 rounded-xl group-hover:bg-gradient-to-r group-hover:from-red-50 group-hover:to-red-50 transition-all duration-300">
                            <div className="font-semibold text-gray-900 mb-1">{story.university}</div>
                            <div className="text-sm text-gray-600 mb-2">{story.program}</div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                {story.scholarship}
                              </span>
                              <span className="text-xs text-gray-500">{story.country}</span>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="mb-4">
                            <StarRating value={story.rating} />
                          </div>

                          {/* Testimonial */}
                          <blockquote className="text-gray-700 leading-relaxed mb-6 italic">
                            &ldquo;{story.text}&rdquo;
                          </blockquote>

                          {/* Hover Effect */}
                          {hoveredIndex === slideIndex * 3 + index && (
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-2xl animate-pulse" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(successStories.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-gradient-to-r from-red-600 to-red-700 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of successful students who have achieved their dreams with Flyover Global. Your journey to a world-class education starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start Your Journey
              </button>
              <button className="px-8 py-3 border-2 border-red-600 text-red-600 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-all duration-300">
                Read More Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}