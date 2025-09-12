import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import Reveal from "@/components/ui/reveal";
import CtaButton from "@/components/cta-button";
import { CheckCircle, FileCheck, Users, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Application Support | Flyover Consultancy",
  description: "Complete assistance with university applications, from document preparation to submission.",
};

const services = [
  "University selection and matching",
  "Application form completion",
  "Document preparation and verification",
  "Personal statement writing assistance",
  "Letter of recommendation guidance",
  "Application submission and tracking",
  "Interview preparation",
  "Scholarship application support"
];

const features = [
  {
    icon: Target,
    title: "Strategic Planning",
    description: "We help you identify the best universities and programs that match your academic profile and career goals."
  },
  {
    icon: FileCheck,
    title: "Document Excellence",
    description: "Professional assistance with all application documents to ensure they meet university standards."
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Our experienced counselors provide personalized support throughout the entire application process."
  }
];

const applicationSteps = [
  {
    step: "01",
    title: "Initial Assessment",
    description: "We evaluate your academic background, career goals, and preferences to create a personalized application strategy."
  },
  {
    step: "02",
    title: "University Selection",
    description: "Based on your profile, we help you select universities and programs that offer the best fit and admission chances."
  },
  {
    step: "03",
    title: "Document Preparation",
    description: "We assist with preparing all required documents including transcripts, certificates, and supporting materials."
  },
  {
    step: "04",
    title: "Application Writing",
    description: "Our experts help craft compelling personal statements and essays that highlight your unique strengths."
  },
  {
    step: "05",
    title: "Submission & Follow-up",
    description: "We handle the application submission process and provide ongoing support until you receive your admission decision."
  }
];

export default function ApplicationSupportPage() {
  return (
    <div>
      <PageHeader
        title="Application Support"
        subtitle="Complete assistance with university applications, from document preparation to submission."
        image="/hero/slide3.svg"
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Overview Section */}
        <section className="mb-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Path to University Admission Success
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                University applications require careful planning, attention to detail, and strategic positioning. 
                Our comprehensive application support ensures your application stands out and maximizes your chances of admission.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <Reveal>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Complete Application Support
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
                  Why Choose Our Application Support?
                </h3>
                <p className="text-gray-700 mb-6">
                  With over 15 years of experience in international education, our team has successfully 
                  helped thousands of students gain admission to their dream universities worldwide.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-brand-600 mb-1">95%</div>
                    <div className="text-sm text-gray-600">Admission Rate</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-brand-600 mb-1">5000+</div>
                    <div className="text-sm text-gray-600">Students Helped</div>
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
                Our Application Support Approach
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

        {/* Application Process Section */}
        <section className="mb-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our 5-Step Application Process
              </h2>
              <p className="text-lg text-gray-600">
                We follow a systematic approach to ensure your application is comprehensive and competitive.
              </p>
            </div>
          </Reveal>

          <div className="space-y-8">
            {applicationSteps.map((step, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="mb-16">
          <Reveal>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Application Success Stories
                </h2>
                <p className="text-lg text-gray-600">
                  See where our students have been accepted with our application support.
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { university: "Harvard University", program: "MBA", country: "USA" },
                  { university: "University of Toronto", program: "Computer Science", country: "Canada" },
                  { university: "University of Melbourne", program: "Engineering", country: "Australia" },
                  { university: "Oxford University", program: "Medicine", country: "UK" }
                ].map((success, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">{success.university}</h4>
                    <p className="text-sm text-gray-600 mb-1">{success.program}</p>
                    <p className="text-xs text-brand-600 font-medium">{success.country}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* CTA Section */}
        <section>
          <Reveal>
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Application Journey?
              </h2>
              <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
                Let our experts help you create a winning application that gets you into your dream university.
              </p>
              <CtaButton />
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}