import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import Reveal from "@/components/ui/reveal";
import CtaButton from "@/components/cta-button";
import { CheckCircle, BookOpen, TrendingUp, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Course Selection | Flyover Consultancy",
  description: "Expert guidance to help you choose the right course and university for your career goals.",
};

const services = [
  "Career assessment and goal alignment",
  "Course and program research",
  "University ranking analysis",
  "Entry requirements evaluation",
  "Career prospects analysis",
  "Industry trends and job market insights",
  "Scholarship and funding opportunities",
  "Course comparison and recommendations"
];

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Research",
    description: "We analyze thousands of courses across multiple universities to find the perfect match for your goals."
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Stay ahead with our analysis of industry trends and job market demands in your field of interest."
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "We only recommend accredited programs from reputable institutions with strong graduate outcomes."
  }
];

const popularFields = [
  {
    field: "Engineering & Technology",
    courses: ["Computer Science", "Software Engineering", "Data Science", "Artificial Intelligence"],
    growth: "+25%",
    salary: "$85,000 - $150,000"
  },
  {
    field: "Business & Management",
    courses: ["MBA", "Finance", "Marketing", "International Business"],
    growth: "+15%",
    salary: "$70,000 - $130,000"
  },
  {
    field: "Healthcare & Medicine",
    courses: ["Medicine", "Nursing", "Public Health", "Pharmacy"],
    growth: "+20%",
    salary: "$80,000 - $200,000"
  },
  {
    field: "Creative & Design",
    courses: ["Graphic Design", "Digital Media", "Architecture", "Fashion Design"],
    growth: "+12%",
    salary: "$50,000 - $90,000"
  }
];

const selectionProcess = [
  {
    step: "Assessment",
    description: "We evaluate your academic background, interests, career goals, and personal preferences."
  },
  {
    step: "Research",
    description: "Our team researches courses and universities that align with your profile and aspirations."
  },
  {
    step: "Analysis",
    description: "We analyze factors like course content, career prospects, entry requirements, and costs."
  },
  {
    step: "Recommendation",
    description: "You receive a personalized report with our top course and university recommendations."
  }
];

export default function CourseSelectionPage() {
  return (
    <div>
      <PageHeader
        title="Course Selection"
        subtitle="Expert guidance to help you choose the right course and university for your career goals."
        image="/hero/slide1.svg"
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Overview Section */}
        <section className="mb-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Future with Confidence
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Selecting the right course is one of the most important decisions you&apos;ll make. Our expert counselors 
                help you navigate through thousands of options to find the perfect program that aligns with your 
                career aspirations and personal goals.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <Reveal>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Our Course Selection Services
                </h3>
                <ul className="space-y-4">
                  {services.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="bg-gradient-to-br from-brand-50 to-blue-50 p-8 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Why Course Selection Matters
                </h3>
                <p className="text-gray-700 mb-6">
                  The right course can be the difference between a fulfilling career and years of regret. 
                  Our data-driven approach ensures you make an informed decision based on current market 
                  trends and future opportunities.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-brand-600 mb-1">10,000+</div>
                    <div className="text-sm text-gray-600">Courses Analyzed</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-brand-600 mb-1">500+</div>
                    <div className="text-sm text-gray-600">Universities</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Course Selection Methodology
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-brand-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Popular Fields Section */}
        <section className="mb-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Study Fields & Career Prospects
              </h2>
              <p className="text-lg text-gray-600">
                Explore trending fields with strong job growth and competitive salaries.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {popularFields.map((field, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{field.field}</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      {field.growth} growth
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Courses:</h4>
                    <div className="flex flex-wrap gap-2">
                      {field.courses.map((course, courseIndex) => (
                        <span key={courseIndex} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Average Salary:</strong> {field.salary}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Selection Process Section */}
        <section className="mb-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our 4-Step Selection Process
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {selectionProcess.map((process, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{process.step}</h3>
                  <p className="text-gray-600 text-sm">{process.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Reveal>
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Find Your Perfect Course?
              </h2>
              <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
                Let our experts help you discover the course that will shape your future career success.
              </p>
              <CtaButton />
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}