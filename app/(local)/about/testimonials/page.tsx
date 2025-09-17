import type { Metadata } from "next";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import Slider from "@/components/ui/slider";
import StarRating from "@/components/ui/star-rating";
import { Quote, Users, Award, Globe } from "lucide-react";
import { dbConnect, toObject } from "@/lib/mongoose";
import SuccessStory from "@/lib/models/SuccessStory";

export const metadata: Metadata = {
  title: "Testimonials | Flyover Consultancy",
  description: "Read success stories from over 22,000 students who achieved their dreams with Flyover Consultancy's expert guidance.",
};


const stats = [
  { icon: Users, label: "Students Placed", value: "22,000+" },
  { icon: Globe, label: "Countries", value: "50+" },
  { icon: Award, label: "Success Rate", value: "98%" },
  { icon: Quote, label: "5-Star Reviews", value: "15,000+" }
];

async function getTestimonials() {
  try {
    await dbConnect();
    const docs = await SuccessStory.find({}).sort({ createdAt: -1 }).lean();
    const normalized = docs.map((doc) => toObject(doc as { _id: unknown }));
    return normalized.map((story: Record<string, unknown>) => ({
      id: (story.id as string) || (story._id as string) || '',
      name: story.author as string,
      country: story.country as string,
      university: story.university as string,
      program: story.program as string,
      rating: story.rating as number,
      text: story.text as string,
      scholarship: story.scholarship as string,
      year: story.year as string,
      avatar: story.avatar as string,
      flag: story.flag as string,
      color: story.color as string
    }));
  } catch (error) {
    console.error('Failed to load testimonials from database:', error);
    return [];
  }
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  
  // Update stats with dynamic data
  const dynamicStats = [
    { icon: Users, label: "Students Placed", value: `${testimonials.length}+` },
    { icon: Globe, label: "Countries", value: "50+" },
    { icon: Award, label: "Success Rate", value: "98%" },
    { icon: Quote, label: "5-Star Reviews", value: "15,000+" }
  ];
  return (
    <div>
      <PageHeader 
        title="Student Success Stories" 
        subtitle={`Over ${testimonials.length} students have achieved their dreams with our expert guidance. Read their inspiring journeys.`} 
        image="/hero/slide3.svg" 
      />
      
      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-brand-50 to-brand-100 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These numbers represent real students who trusted us with their future and achieved their academic goals.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {dynamicStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 text-white rounded-full mb-4">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real stories from real students who transformed their lives with our guidance.
              </p>
            </div>
          </Reveal>
          
          {testimonials.length > 0 ? (
            <Slider autoplayMs={8000}>
              {[0, 1].map((slideIndex) => (
              <div key={slideIndex} className="px-2">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {testimonials.slice(slideIndex * 3, (slideIndex + 1) * 3).map((testimonial, index: number) => (
                    <Reveal key={index} delay={index * 0.1}>
                      <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center mb-6">
                          <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                            {testimonial.avatar}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                              <span className="text-lg">{testimonial.flag}</span>
                            </div>
                            <p className="text-sm text-gray-600">{testimonial.program}</p>
                            <p className="text-sm text-gray-600">{testimonial.university}</p>
                            <p className="text-xs text-green-600 font-medium mt-1">{testimonial.scholarship}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <StarRating value={testimonial.rating} />
                        </div>
                        
                        <blockquote className="text-gray-700 leading-relaxed">
                          <Quote className="w-6 h-6 text-brand-400 mb-2" />
                          <p>&ldquo;{testimonial.text}&rdquo;</p>
                        </blockquote>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Quote className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Testimonials Available</h3>
                <p className="text-gray-600">
                  We&apos;re collecting success stories from our students. Check back soon to read inspiring testimonials!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-brand-100 mb-8">
              Join thousands of students who have achieved their dreams with our expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/book-consultation" 
                className="bg-white text-brand-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Book Free Consultation
              </a>
              <a 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-brand-600 transition-colors duration-200"
              >
                Contact Us Today
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
