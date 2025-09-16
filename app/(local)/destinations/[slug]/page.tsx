import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import { MapPin, Users, GraduationCap, Globe, ArrowRight, Calendar, DollarSign, FileText, Award, Heart} from "lucide-react";
import { UniversityImage } from "@/components/ui/lazy-image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

async function getDestination(slug: string) {
  try {
    // First try to fetch from API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/destinations/${slug}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.destination) {
        return data.destination;
      }
    }
  } catch (error) {
    console.log('API not available for destination, using test data:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  // Fallback to test data
  try {
    const testData = await import('@/data/destinations-test-data.json');
    const destination = testData.destinations.find((dest) => dest.slug === slug);
    return destination || null;
  } catch (error) {
    console.error('Error loading test data for destination:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestination(slug);
  
  if (!destination) {
    return {
      title: "Country Not Found | Flyover Consultancy",
      description: "The requested study destination was not found."
    };
  }

  return {
    title: `Study in ${destination.country} | Flyover Consultancy`,
    description: `Complete guide to studying in ${destination.country}. Universities, costs, visas, scholarships, and more. ${destination.description}`
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = await getDestination(slug);

  if (!destination) {
    notFound();
  }

  // Parse markdown content if available
  const overviewMD = destination.overviewMD || '';
  const costsMD = destination.costsMD || '';
  const intakesMD = destination.intakesMD || '';
  const visaMD = destination.visaMD || '';
  const scholarshipsMD = destination.scholarshipsMD || '';

  // Parse FAQs if available
  const faqs = destination.faqs ? (typeof destination.faqs === 'string' ? JSON.parse(destination.faqs) : destination.faqs) : [];

  return (
    <div>
      <PageHeader
        title={`Study in ${destination.country}`}
        subtitle={destination.description}
        image={"/hero/slide1.svg"}
      />

      {/* Quick Overview */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">{destination.flag}</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Overview</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <Reveal delay={0.1}>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Universities</div>
                <div className="font-semibold text-gray-900 text-sm">{Array.isArray(destination.universities) ? `${destination.universities.length}+` : 'N/A'}</div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Students</div>
                <div className="font-semibold text-gray-900 text-sm">{destination.students}</div>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Average Cost</div>
                <div className="font-semibold text-gray-900 text-sm">{destination.averageCost}</div>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Work Rights</div>
                <div className="font-semibold text-gray-900 text-sm">{destination.workRights}</div>
              </div>
            </Reveal>
            <Reveal delay={0.5}>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Popular Cities</div>
                <div className="font-semibold text-gray-900 text-sm">{destination.popularCities?.join(', ') || 'N/A'}</div>
                  </div>
            </Reveal>
            <Reveal delay={0.6}>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Highlights</div>
                <div className="font-semibold text-gray-900 text-sm">{destination.highlights?.slice(0, 2).join(', ') || 'N/A'}</div>
                </div>
              </Reveal>
          </div>
        </div>
      </section>

      {/* Education System */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Education System</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the academic excellence and research opportunities available in {destination.country}.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Reveal delay={0.1}>
              <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                <div className="text-2xl font-bold text-brand-600 mb-2">{Array.isArray(destination.universities) ? `${destination.universities.length}+` : 'N/A'}</div>
                <div className="text-sm text-gray-600">Universities</div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                <div className="text-2xl font-bold text-brand-600 mb-2">{destination.students}</div>
                <div className="text-sm text-gray-600">International Students</div>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                <div className="text-2xl font-bold text-brand-600 mb-2">{destination.averageCost}</div>
                <div className="text-sm text-gray-600">Average Cost</div>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
                <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                <div className="text-2xl font-bold text-brand-600 mb-2">{destination.workRights}</div>
                <div className="text-sm text-gray-600">Work Rights</div>
                  </div>
            </Reveal>
            <Reveal delay={0.5}>
              <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                <div className="text-2xl font-bold text-brand-600 mb-2">{destination.popularCities?.length || 0}</div>
                <div className="text-sm text-gray-600">Popular Cities</div>
                </div>
              </Reveal>
          </div>
        </div>
      </section>

      {/* Overview Content */}
      {overviewMD && (
        <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Overview</h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {overviewMD}
                  </ReactMarkdown>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Top Universities Section */}
      <section className="py-16 bg-gradient-to-r from-brand-50 to-brand-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Universities</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore world-renowned institutions offering excellent academic programs and research opportunities.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(destination.universities) && destination.universities.length > 0 ? (
              destination.universities.map((university: { name: string; image?: string; ranking?: string; location?: string; courses?: string[] }, index: number) => (
                <Reveal key={university.name || index} delay={0.1 * (index + 1)}>
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative h-48 overflow-hidden">
                      <UniversityImage
                        src={university.image || "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80"}
                        alt={`${university.name} campus`}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                      {university.ranking && (
                        <div className="absolute top-4 right-4 z-20">
                          <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-brand-600 shadow-lg">
                            {university.ranking}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{university.name}</h3>
                      {university.location && (
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span>{university.location}</span>
                        </div>
                      )}
                      {university.courses && Array.isArray(university.courses) && (
                        <div className="flex flex-wrap gap-2">
                          {university.courses.slice(0, 3).map((course: string, courseIndex: number) => (
                            <span key={courseIndex} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200">
                              {course}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  No universities data available for {destination.country}
                </div>
                <p className="text-gray-400">
                  University information will be displayed here once available.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Costs & Scholarships */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Costs */}
            <Reveal>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-8 h-8 text-brand-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Study Costs</h3>
                </div>
                {costsMD ? (
                  <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {costsMD}
                    </ReactMarkdown>
                  </div>
                ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Average Cost</span>
                      <span className="font-semibold text-gray-900">{destination.averageCost}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-4">
                      <p>Costs may vary depending on the university, program, and location. Contact us for detailed cost breakdowns for specific programs.</p>
                    </div>
                </div>
                )}
              </div>
            </Reveal>

            {/* Scholarships */}
            <Reveal delay={0.2}>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <Award className="w-8 h-8 text-brand-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Scholarships</h3>
                </div>
                {scholarshipsMD ? (
                  <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {scholarshipsMD}
                    </ReactMarkdown>
                  </div>
                ) : (
                <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="font-semibold text-gray-900 mb-1">Merit-based Scholarships</div>
                      <div className="text-sm text-brand-600 font-medium mb-2">Up to 100% tuition</div>
                      <div className="text-xs text-gray-500">For outstanding academic performance</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="font-semibold text-gray-900 mb-1">Need-based Financial Aid</div>
                      <div className="text-sm text-brand-600 font-medium mb-2">Varies</div>
                      <div className="text-xs text-gray-500">Based on demonstrated financial need</div>
                    </div>
                    <div className="text-sm text-gray-500 mt-4">
                      <p>Contact us to learn about specific scholarship opportunities for your chosen program.</p>
                    </div>
                </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Visa Information */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Visa Information</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about student visa requirements and work rights.
              </p>
            </div>
          </Reveal>
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
            {visaMD ? (
              <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {visaMD}
                </ReactMarkdown>
              </div>
            ) : (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-brand-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">Visa Details</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                      <span className="text-gray-600">Work Rights:</span>
                      <span className="font-medium text-gray-900">{destination.workRights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Time:</span>
                      <span className="font-medium text-gray-900">4-8 weeks</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-gray-600">Visa Type:</span>
                      <span className="font-medium text-gray-900">Student Visa</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-brand-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">Requirements</h3>
                </div>
                <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">University acceptance letter</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Financial documentation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">English proficiency test</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Health insurance</span>
                    </li>
                </ul>
              </div>
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Intakes */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Academic Intakes</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Plan your application timeline with available intake periods and deadlines.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {intakesMD ? (
              <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto col-span-3">
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {intakesMD}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <>
                <Reveal delay={0.1}>
                  <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                    <Calendar className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Fall Intake</h3>
                    <div className="text-brand-600 font-medium mb-2">August - September</div>
                    <div className="text-sm text-gray-600">
                      <strong>Application Deadline:</strong><br />
                      December - February
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.2}>
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <Calendar className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Spring Intake</h3>
                    <div className="text-brand-600 font-medium mb-2">January - February</div>
                  <div className="text-sm text-gray-600">
                    <strong>Application Deadline:</strong><br />
                      September - October
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                    <Calendar className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Summer Intake</h3>
                    <div className="text-brand-600 font-medium mb-2">May - June</div>
                    <div className="text-sm text-gray-600">
                      <strong>Application Deadline:</strong><br />
                      February - March
                  </div>
                </div>
              </Reveal>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      {destination.popularCourses && destination.popularCourses.length > 0 && (
      <section className="py-16 bg-gradient-to-r from-brand-50 to-brand-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Courses</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Explore the most sought-after academic programs in {destination.country}.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {destination.popularCourses?.map((course: string, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-lg text-center">
                    <GraduationCap className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">{course}</h3>
                  </div>
                )) || (
                  <div className="col-span-full text-center text-gray-500">
                    <p>No popular courses available</p>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Lifestyle & Culture */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Life & Culture</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the unique lifestyle and cultural opportunities that await you in {destination.country}.
              </p>
            </div>
          </Reveal>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <Heart className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Quality of Life</h3>
                <p className="text-sm text-gray-600">High standard of living with excellent healthcare and infrastructure</p>
              </div>
              <div className="text-center">
                <Globe className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Safety</h3>
                <p className="text-sm text-gray-600">Generally very safe with low crime rates</p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Culture</h3>
                <p className="text-sm text-gray-600">Diverse, multicultural environment with rich traditions</p>
              </div>
              <div className="text-center">
                <MapPin className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Popular Cities</h3>
                <p className="text-sm text-gray-600">{destination.popularCities?.join(", ") || 'Major cities available'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Get answers to common questions about studying in {destination.country}.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="max-w-4xl mx-auto space-y-6">
                {faqs.map((faq: { question: string; answer: string }, index: number) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className={`py-16 bg-gradient-to-r ${destination.color || 'from-blue-400 to-blue-600'}`}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <div className="text-6xl mb-6">{destination.flag}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Study in {destination.country}?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get personalized guidance for your {destination.country} education journey. Our experts are here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/book-consultation" 
                className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Free Consultation
              </a>
              <a 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-200 inline-flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Get Expert Guidance
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
