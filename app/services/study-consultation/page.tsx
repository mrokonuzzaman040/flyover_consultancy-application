import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import Reveal from "@/components/ui/reveal";
import CtaButton from "@/components/cta-button";
import { CheckCircle, Users, BookOpen, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Study Consultation | Flyover Consultancy",
  description: "Expert guidance to help you choose the right course and university for your goals.",
};

const benefits = [
  "Personalized academic pathway planning",
  "University and course recommendations",
  "Career-focused program selection",
  "Budget and scholarship guidance",
  "Timeline and application strategy",
  "One-on-one expert counseling"
];

const features = [
  {
    icon: Users,
    title: "Expert Counselors",
    description: "Work with experienced education consultants who understand global academic systems."
  },
  {
    icon: BookOpen,
    title: "Comprehensive Research",
    description: "Access detailed information about universities, courses, and career prospects."
  },
  {
    icon: Target,
    title: "Goal-Oriented Planning",
    description: "Develop a clear roadmap aligned with your career aspirations and academic interests."
  }
];

export default function StudyConsultationPage() {
  return (
    <div>
      <PageHeader
        title="Study Consultation"
        subtitle="Expert guidance to help you choose the right course and university for your goals."
        image="/hero/slide1.svg"
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Overview Section */}
        <section className="mb-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Make Informed Decisions About Your Future
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our comprehensive study consultation service helps you navigate the complex world of international education. 
                We provide personalized guidance to ensure you choose the right academic path for your career goals.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <Reveal>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  What&apos;s Included in Our Consultation
                </h3>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="bg-gradient-to-br from-brand-50 to-blue-50 p-8 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Why Choose Our Consultation?
                </h3>
                <p className="text-gray-700 mb-6">
                  With years of experience in international education, our consultants have helped thousands of students 
                  find their perfect academic match. We understand the nuances of different education systems and can 
                  guide you through every step of the decision-making process.
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-brand-600 mb-1">95%</div>
                  <div className="text-sm text-gray-600">Student satisfaction rate</div>
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
                How We Help You Succeed
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

        {/* CTA Section */}
        <section>
          <Reveal>
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Academic Journey?
              </h2>
              <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
                Book a free consultation with our expert counselors and take the first step towards your dream education.
              </p>
              <CtaButton />
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}