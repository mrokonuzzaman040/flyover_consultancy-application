import type { Metadata } from "next";
import { ChevronDownIcon, SearchIcon, BookOpenIcon, GraduationCapIcon, FileTextIcon, CreditCardIcon, MapPinIcon, ClockIcon } from "lucide-react";
import PageHeader from "@/components/page-header";
import Reveal from "@/components/ui/reveal";
import CtaButton from "@/components/cta-button";

export const metadata: Metadata = {
  title: "FAQ | Flyover Consultancy",
  description: "Frequently asked questions about studying abroad, visa applications, and our services.",
};

const faqCategories = [
  {
    id: "general",
    title: "General Questions",
    icon: BookOpenIcon,
    color: "bg-blue-50 text-blue-600",
    questions: [
      {
        question: "What services does Flyover Consultancy offer?",
        answer: "We provide comprehensive study abroad services including university selection, application assistance, visa guidance, scholarship information, and pre-departure support."
      },
      {
        question: "How much do your services cost?",
        answer: "Our service fees vary depending on the package you choose. We offer flexible payment plans and transparent pricing with no hidden costs. Contact us for a detailed quote."
      },
      {
        question: "How long does the application process take?",
        answer: "The timeline varies by country and university, but typically ranges from 3-8 months. We recommend starting the process at least 6-12 months before your intended start date."
      }
    ]
  },
  {
    id: "applications",
    title: "Applications & Admissions",
    icon: GraduationCapIcon,
    color: "bg-green-50 text-green-600",
    questions: [
      {
        question: "What are the minimum requirements for studying abroad?",
        answer: "Requirements vary by country and program, but generally include academic transcripts, English proficiency tests (IELTS/TOEFL), letters of recommendation, and a statement of purpose."
      },
      {
        question: "Can I apply to multiple universities?",
        answer: "Yes, we recommend applying to 5-8 universities to increase your chances of acceptance. We help you create a balanced list of reach, match, and safety schools."
      },
      {
        question: "What if my grades are not perfect?",
        answer: "Don't worry! Many factors are considered in admissions. We help highlight your strengths, work experience, extracurriculars, and personal story to create a compelling application."
      }
    ]
  },
  {
    id: "visa",
    title: "Visa & Immigration",
    icon: FileTextIcon,
    color: "bg-purple-50 text-purple-600",
    questions: [
      {
        question: "How long does visa processing take?",
        answer: "Visa processing times vary by country: USA (2-8 weeks), Canada (4-12 weeks), UK (3-6 weeks), Australia (4-8 weeks). We help you apply at the right time."
      },
      {
        question: "What documents do I need for a student visa?",
        answer: "Common documents include passport, acceptance letter, financial statements, academic transcripts, English proficiency scores, and medical certificates. Requirements vary by country."
      },
      {
        question: "What if my visa gets rejected?",
        answer: "We provide comprehensive visa support and have a high success rate. If rejected, we analyze the reasons and help you reapply with a stronger application."
      }
    ]
  },
  {
    id: "financial",
    title: "Finances & Scholarships",
    icon: CreditCardIcon,
    color: "bg-orange-50 text-orange-600",
    questions: [
      {
        question: "How much money do I need to study abroad?",
        answer: "Costs vary significantly by country and program. Generally, budget $20,000-60,000 per year including tuition and living expenses. We provide detailed cost breakdowns for each destination."
      },
      {
        question: "Are scholarships available for international students?",
        answer: "Yes! Many universities and organizations offer scholarships. We help identify and apply for relevant scholarships based on your profile and chosen destination."
      },
      {
        question: "Can I work while studying?",
        answer: "Most countries allow part-time work for international students (typically 20 hours/week). This can help cover living expenses and gain valuable experience."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div>
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about studying abroad and our services"
        image="/hero/slide1.svg"
      />
      
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Search Section */}
        <Reveal>
          <div className="mb-12 text-center">
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <Reveal key={category.id} delay={categoryIndex * 0.1}>
                <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                  <div className="mb-8 flex items-center gap-4">
                    <div className={`rounded-xl p-3 ${category.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <Reveal key={index} delay={(categoryIndex * 0.1) + (index * 0.05)}>
                        <details className="group rounded-lg border border-gray-200 bg-gray-50 transition-all hover:bg-gray-100">
                          <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-gray-900">
                            <span className="text-left">{faq.question}</span>
                            <ChevronDownIcon className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180" />
                          </summary>
                          <div className="border-t border-gray-200 px-6 pb-6 pt-4">
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        </details>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Reveal delay={0.6}>
          <div className="mt-16 rounded-2xl bg-gradient-to-b from-brand-700 to-brand-300 p-8 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Our expert counselors are here to help you with personalized guidance for your study abroad journey.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <ClockIcon className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-blue-200 text-sm">Support Available</div>
                </div>
                <div className="text-center">
                  <GraduationCapIcon className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                  <div className="text-2xl font-bold">5000+</div>
                  <div className="text-blue-200 text-sm">Students Helped</div>
                </div>
                <div className="text-center">
                  <MapPinIcon className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                  <div className="text-2xl font-bold">25+</div>
                  <div className="text-blue-200 text-sm">Countries</div>
                </div>
              </div>
              <CtaButton href="/contact">
                Get Personalized Help
              </CtaButton>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}