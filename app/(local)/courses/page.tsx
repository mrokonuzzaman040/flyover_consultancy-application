import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import Reveal from "@/components/ui/reveal";
import CtaButton from "@/components/cta-button";
import { GraduationCap, TrendingUp, DollarSign, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Popular Courses | Flyover Consultancy",
  description: "Explore popular study programs with excellent career prospects and high demand in the global job market.",
};

const COURSES = [
  {
    name: "Nursing",
    description: "Healthcare profession with high demand globally, offering diverse specialization opportunities.",
    duration: "3-4 years",
    averageSalary: "$70,000 - $95,000",
    jobGrowth: "+15%",
    popularCountries: ["Australia", "Canada", "UK", "USA"],
    keySkills: ["Patient Care", "Medical Knowledge", "Communication", "Critical Thinking"],
    careerPaths: ["Registered Nurse", "Nurse Practitioner", "Clinical Specialist", "Nurse Manager"]
  },
  {
    name: "Accounting",
    description: "Essential business function with stable career prospects and opportunities in every industry.",
    duration: "3-4 years",
    averageSalary: "$55,000 - $85,000",
    jobGrowth: "+8%",
    popularCountries: ["Australia", "Canada", "UK", "New Zealand"],
    keySkills: ["Financial Analysis", "Tax Planning", "Auditing", "Business Advisory"],
    careerPaths: ["Accountant", "Financial Analyst", "Tax Consultant", "CFO"]
  },
  {
    name: "Information Technology",
    description: "Fast-growing field with excellent career prospects in software development, cybersecurity, and data analysis.",
    duration: "3-4 years",
    averageSalary: "$75,000 - $120,000",
    jobGrowth: "+25%",
    popularCountries: ["USA", "Canada", "Australia", "Germany"],
    keySkills: ["Programming", "System Design", "Database Management", "Problem Solving"],
    careerPaths: ["Software Developer", "System Analyst", "IT Manager", "Data Scientist"]
  },
  {
    name: "Engineering",
    description: "Diverse field offering solutions to real-world problems with strong job security and growth.",
    duration: "4-5 years",
    averageSalary: "$70,000 - $110,000",
    jobGrowth: "+12%",
    popularCountries: ["Germany", "Canada", "Australia", "USA"],
    keySkills: ["Technical Design", "Problem Solving", "Project Management", "Innovation"],
    careerPaths: ["Design Engineer", "Project Manager", "Technical Lead", "Engineering Director"]
  },
  {
    name: "Business & Management",
    description: "Versatile degree opening doors to leadership roles across industries and entrepreneurship.",
    duration: "3-4 years",
    averageSalary: "$60,000 - $100,000",
    jobGrowth: "+10%",
    popularCountries: ["USA", "UK", "Canada", "Australia"],
    keySkills: ["Leadership", "Strategic Planning", "Communication", "Financial Management"],
    careerPaths: ["Business Analyst", "Operations Manager", "Consultant", "CEO"]
  },
  {
    name: "Data Science",
    description: "High-demand field combining statistics, programming, and business acumen to extract insights from data.",
    duration: "3-4 years",
    averageSalary: "$85,000 - $130,000",
    jobGrowth: "+35%",
    popularCountries: ["USA", "Canada", "UK", "Australia"],
    keySkills: ["Statistical Analysis", "Machine Learning", "Programming", "Data Visualization"],
    careerPaths: ["Data Analyst", "Data Scientist", "ML Engineer", "Chief Data Officer"]
  },
  {
    name: "Hospitality & Tourism",
    description: "Dynamic industry focused on customer service, event management, and global travel experiences.",
    duration: "3-4 years",
    averageSalary: "$45,000 - $75,000",
    jobGrowth: "+18%",
    popularCountries: ["Australia", "Switzerland", "Canada", "UK"],
    keySkills: ["Customer Service", "Event Planning", "Cultural Awareness", "Management"],
    careerPaths: ["Hotel Manager", "Event Coordinator", "Tourism Director", "Resort Manager"]
  }
];

export default function CoursesPage() {
  return (
    <div>
      <PageHeader
        title="Popular Courses"
        subtitle="Explore study programs with excellent career prospects and high demand in the global job market."
        image="/hero/slide3.svg"
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Overview Section */}
        <section className="mb-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Path to Success
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our carefully selected courses offer excellent career prospects, competitive salaries, 
                and strong job growth in today&apos;s global market. Each program is designed to prepare 
                you for success in your chosen field.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Courses Grid */}
        <section className="mb-16">
          <div className="grid gap-8 lg:grid-cols-2">
            {COURSES.map((course, index) => (
              <Reveal key={course.name} delay={index * 0.1}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Course Header */}
                  <div className="bg-gradient-to-r from-brand-50 to-blue-50 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.name}</h3>
                        <p className="text-gray-700">{course.description}</p>
                      </div>
                      <GraduationCap className="w-8 h-8 text-brand-600 flex-shrink-0" />
                    </div>
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <Clock className="w-5 h-5 text-brand-600 mx-auto mb-1" />
                        <div className="text-sm font-medium text-gray-900">{course.duration}</div>
                        <div className="text-xs text-gray-600">Duration</div>
                      </div>
                      <div className="text-center">
                        <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <div className="text-sm font-medium text-gray-900">{course.averageSalary}</div>
                        <div className="text-xs text-gray-600">Avg Salary</div>
                      </div>
                      <div className="text-center">
                        <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-sm font-medium text-gray-900">{course.jobGrowth}</div>
                        <div className="text-xs text-gray-600">Job Growth</div>
                      </div>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="p-6">
                    {/* Popular Countries */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Popular Study Destinations</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.popularCountries.map((country) => (
                          <span key={country} className="bg-brand-100 text-brand-800 text-xs font-medium px-3 py-1 rounded-full">
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Skills */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Skills You&apos;ll Develop</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {course.keySkills.map((skill) => (
                          <div key={skill} className="flex items-center text-sm text-gray-700">
                            <span className="w-2 h-2 bg-brand-500 rounded-full mr-2"></span>
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Career Paths */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Career Opportunities</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {course.careerPaths.map((path) => (
                          <div key={path} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                            {path}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
                Ready to Start Your Academic Journey?
              </h2>
              <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
                Get personalized course recommendations and application guidance from our expert counselors.
              </p>
              <CtaButton />
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
