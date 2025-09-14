import type { Metadata } from "next";
import { CheckCircleIcon, LightbulbIcon, AlertTriangleIcon, ClockIcon, FileTextIcon, UserIcon, StarIcon, BookOpenIcon, GraduationCapIcon, TrendingUpIcon } from "lucide-react";
import PageHeader from "@/components/page-header";
import Reveal from "@/components/ui/reveal";
import CtaButton from "@/components/cta-button";

export const metadata: Metadata = {
  title: "Application Tips | Flyover Consultancy",
  description: "Expert tips and strategies to create winning study abroad applications and increase your chances of admission.",
};

const applicationSteps = [
  {
    step: 1,
    title: "Research & Planning",
    duration: "2-3 months",
    description: "Research universities, programs, and requirements thoroughly before starting your application.",
    tips: [
      "Create a spreadsheet to track deadlines and requirements",
      "Research faculty and their research interests",
      "Check ranking and accreditation status",
      "Consider location, climate, and living costs"
    ],
    icon: BookOpenIcon,
    color: "bg-blue-50 text-blue-600"
  },
  {
    step: 2,
    title: "Document Preparation",
    duration: "1-2 months",
    description: "Gather and prepare all required documents including transcripts, test scores, and recommendations.",
    tips: [
      "Order official transcripts early",
      "Take standardized tests with enough time for retakes",
      "Request recommendation letters 2 months in advance",
      "Prepare certified translations if needed"
    ],
    icon: FileTextIcon,
    color: "bg-green-50 text-green-600"
  },
  {
    step: 3,
    title: "Personal Statement",
    duration: "3-4 weeks",
    description: "Craft compelling personal statements that showcase your unique story and motivations.",
    tips: [
      "Start with a compelling hook",
      "Show, don&apos;t tell your achievements",
      "Connect your goals to the specific program",
      "Get feedback from multiple people"
    ],
    icon: UserIcon,
    color: "bg-purple-50 text-purple-600"
  },
  {
    step: 4,
    title: "Application Submission",
    duration: "1-2 weeks",
    description: "Submit your applications well before deadlines and follow up appropriately.",
    tips: [
      "Submit at least 1 week before deadline",
      "Double-check all information for accuracy",
      "Pay application fees promptly",
      "Keep copies of all submitted documents"
    ],
    icon: CheckCircleIcon,
    color: "bg-orange-50 text-orange-600"
  }
];

const expertTips = [
  {
    category: "Personal Statement",
    icon: UserIcon,
    tips: [
      {
        title: "Tell Your Unique Story",
        description: "Focus on experiences that shaped your academic and career goals. Avoid generic statements.",
        type: "success"
      },
      {
        title: "Be Specific About the Program",
        description: "Mention specific courses, faculty, or research opportunities that attract you to the program.",
        type: "success"
      },
      {
        title: "Avoid Common Mistakes",
        description: "Don&apos;t repeat information from your CV or use clichés like &apos;I want to make a difference&apos;.",
        type: "warning"
      }
    ]
  },
  {
    category: "Academic Records",
    icon: GraduationCapIcon,
    tips: [
      {
        title: "Explain Grade Inconsistencies",
        description: "If you have low grades in certain semesters, provide context in your additional information section.",
        type: "info"
      },
      {
        title: "Highlight Relevant Coursework",
        description: "Emphasize courses directly related to your intended field of study.",
        type: "success"
      },
      {
        title: "Show Academic Growth",
        description: "Demonstrate improvement over time and increasing academic rigor.",
        type: "success"
      }
    ]
  },
  {
    category: "Test Scores",
    icon: TrendingUpIcon,
    tips: [
      {
        title: "Meet Minimum Requirements",
        description: "Ensure your test scores meet the minimum requirements for your target programs.",
        type: "warning"
      },
      {
        title: "Retake if Necessary",
        description: "If your scores are below average for your target schools, consider retaking the tests.",
        type: "info"
      },
      {
        title: "Submit All Scores",
        description: "Some schools require all test scores, not just your highest ones.",
        type: "warning"
      }
    ]
  }
];

const commonMistakes = [
  {
    mistake: "Applying to Too Few Schools",
    solution: "Apply to 6-8 schools with a mix of reach, match, and safety options.",
    impact: "High"
  },
  {
    mistake: "Missing Deadlines",
    solution: "Create a calendar with all deadlines and submit applications early.",
    impact: "Critical"
  },
  {
    mistake: "Generic Personal Statements",
    solution: "Customize each statement for the specific program and university.",
    impact: "High"
  },
  {
    mistake: "Weak Letters of Recommendation",
    solution: "Choose recommenders who know you well and provide them with detailed information.",
    impact: "Medium"
  },
  {
    mistake: "Ignoring Fit",
    solution: "Research program culture, faculty, and opportunities to ensure good fit.",
    impact: "Medium"
  },
  {
    mistake: "Poor Application Organization",
    solution: "Use spreadsheets to track requirements, deadlines, and submission status.",
    impact: "Medium"
  }
];

export default function ApplicationTipsPage() {
  return (
    <div>
      <PageHeader
        title="Application Tips"
        subtitle="Expert strategies to create winning applications and maximize your admission chances"
        image="/hero/slide2.svg"
      />
      
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Overview Section */}
        <Reveal>
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Master Your Application Process</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A strong application is your gateway to top universities. Follow our proven strategies and expert tips 
              to create applications that stand out from the competition.
            </p>
          </div>
        </Reveal>

        {/* Application Timeline */}
        <div className="mb-20">
          <Reveal>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <ClockIcon className="h-6 w-6 text-blue-600" />
              Application Timeline
            </h3>
          </Reveal>
          
          <div className="space-y-8">
            {applicationSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Reveal key={step.step} delay={index * 0.1}>
                  <div className="relative">
                    {index < applicationSteps.length - 1 && (
                      <div className="absolute left-6 top-16 h-16 w-0.5 bg-gray-200"></div>
                    )}
                    <div className="flex gap-6">
                      <div className={`flex-shrink-0 rounded-full p-3 ${step.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xl font-semibold text-gray-900">
                            Step {step.step}: {step.title}
                          </h4>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{step.description}</p>
                        <div className="grid gap-2 md:grid-cols-2">
                          {step.tips.map((tip, tipIndex) => (
                            <div key={tipIndex} className="flex items-start gap-2">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Expert Tips by Category */}
        <div className="mb-20">
          <Reveal>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <LightbulbIcon className="h-6 w-6 text-blue-600" />
              Expert Tips by Category
            </h3>
          </Reveal>
          
          <div className="space-y-8">
            {expertTips.map((category, categoryIndex) => {
              const IconComponent = category.icon;
              return (
                <Reveal key={categoryIndex} delay={categoryIndex * 0.1}>
                  <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="rounded-lg bg-blue-50 p-2">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900">{category.category}</h4>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {category.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className={`rounded-lg p-4 border-l-4 ${
                          tip.type === 'success' ? 'bg-green-50 border-green-400' :
                          tip.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                          'bg-blue-50 border-blue-400'
                        }`}>
                          <h5 className="font-medium text-gray-900 mb-2">{tip.title}</h5>
                          <p className="text-sm text-gray-700">{tip.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="mb-16">
          <Reveal>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <AlertTriangleIcon className="h-6 w-6 text-brand-600" />
              Common Mistakes to Avoid
            </h3>
          </Reveal>
          
          <div className="grid gap-6 md:grid-cols-2">
            {commonMistakes.map((item, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex-1">{item.mistake}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.impact === 'Critical' ? 'bg-brand-100 text-brand-700' :
                      item.impact === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.impact} Impact
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <strong>Solution:</strong> {item.solution}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Success Statistics */}
        <Reveal delay={0.3}>
          <div className="mb-16 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Our Application Success Rate</h3>
              <p className="text-green-100 max-w-2xl mx-auto">
                Students who follow our application strategies have significantly higher acceptance rates.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">94%</div>
                <div className="text-green-200 text-sm">Acceptance Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">87%</div>
                <div className="text-green-200 text-sm">First Choice Admits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">$2.3M</div>
                <div className="text-green-200 text-sm">Scholarships Won</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">5000+</div>
                <div className="text-green-200 text-sm">Success Stories</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA Section */}
        <Reveal delay={0.4}>
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 text-center">
            <StarIcon className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Application?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Get personalized guidance from our expert counselors who have helped thousands of students 
              get accepted to their dream universities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CtaButton href="/contact" className="bg-blue-600 text-white hover:bg-blue-700">
                Get Application Help
              </CtaButton>
              <CtaButton href="/resources/study-guides" className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                Download Study Guides
              </CtaButton>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}