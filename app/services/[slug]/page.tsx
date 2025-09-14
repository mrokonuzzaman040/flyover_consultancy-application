import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/page-header";
import Reveal from "@/components/ui/reveal";
import CtaButton from "@/components/cta-button";
import { CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  sectionsMD: string[];
  features?: Feature[];
  benefits?: string[];
  process?: ProcessStep[];
  ctaLabel?: string;
  ctaText?: string;
  createdAt: string;
  updatedAt: string;
}

async function getService(slug: string): Promise<Service | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/services`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('API response not ok:', response.status);
      return null;
    }
    
    const data = await response.json();
    console.log('Fetched services:', data.services?.length || 0);
    const service = data.services?.find((s: Service) => s.slug === slug);
    console.log('Found service for slug:', slug, service ? service.name : 'not found');
    return service || null;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getService(params.slug);
  
  if (!service) {
    return {
      title: 'Service Not Found | Flyover Consultancy',
      description: 'The requested service could not be found.'
    };
  }

  return {
    title: `${service.title || service.name} | Flyover Consultancy`,
    description: service.subtitle || service.description || `Learn more about ${service.name} services at Flyover Consultancy.`
  };
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);

  if (!service) {
    notFound();
  }

  const pageTitle = service.title || service.name;
  const pageSubtitle = service.subtitle || service.description || '';
  const heroImage = service.image || '/hero/slide1.svg';

  return (
    <div>
      <PageHeader
        title={pageTitle}
        subtitle={pageSubtitle}
        image={heroImage}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Description Section */}
        {service.description && (
          <section className="mb-16">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  About {service.name}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {service.description}
                </p>
              </div>
            </Reveal>
          </section>
        )}

        {/* Content Sections */}
        {service.sectionsMD && service.sectionsMD.length > 0 && (
          <section className="mb-16">
            {service.sectionsMD.map((section, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700 mb-8">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {section}
                  </ReactMarkdown>
                </div>
              </Reveal>
            ))}
          </section>
        )}

        {/* Benefits Section */}
        {service.benefits && service.benefits.length > 0 && (
          <section className="mb-16">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What We Offer
                </h2>
                <p className="text-lg text-gray-600">
                  Comprehensive services to help you achieve your goals.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <Reveal>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    Our {service.name} Services
                  </h3>
                  <ul className="space-y-4">
                    {service.benefits.map((benefit, index) => (
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
                    Why Choose Our {service.name}?
                  </h3>
                  <p className="text-gray-700 mb-6">
                    With years of experience in international education, our team has successfully 
                    helped thousands of students achieve their academic and career goals.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-brand-600 mb-1">95%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
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
        )}

        {/* Features Section */}
        {service.features && service.features.length > 0 && (
          <section className="mb-16">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Approach
                </h2>
              </div>
            </Reveal>

            <div className="grid gap-8 md:grid-cols-3">
              {service.features.map((feature, index) => {
                // You can map icon names to actual icon components here
                const getIconComponent = (iconName: string) => {
                  // For now, we'll use a generic icon
                  // You can expand this to map to specific Lucide icons
                  return CheckCircle;
                };
                
                const IconComponent = getIconComponent(feature.icon);
                
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
        )}

        {/* Process Section */}
        {service.process && service.process.length > 0 && (
          <section className="mb-16">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Process
                </h2>
                <p className="text-lg text-gray-600">
                  We follow a systematic approach to ensure your success.
                </p>
              </div>
            </Reveal>

            <div className="space-y-8">
              {service.process.map((step, index) => (
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
        )}

        {/* CTA Section */}
        <section>
          <Reveal>
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                {service.ctaText || `Ready to Get Started with ${service.name}?`}
              </h2>
              <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
                Let our experts help you achieve your goals with our comprehensive {service.name.toLowerCase()} services.
              </p>
              <CtaButton />
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
