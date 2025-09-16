import type { Metadata } from "next";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import Slider from "@/components/ui/slider";
import StarRating from "@/components/ui/star-rating";
import { Quote, Users, Award, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Testimonials | Flyover Consultancy",
  description: "Read success stories from over 22,000 students who achieved their dreams with Flyover Consultancy's expert guidance.",
};

const testimonials = [
  {
    name: "Sarah Johnson",
    country: "USA",
    university: "Harvard University",
    program: "MBA",
    rating: 5,
    text: "Flyover Consultancy made my dream of studying at Harvard a reality. Their personalized guidance and expert knowledge of the admission process were invaluable. I couldn't have done it without them!",
    image: "/testimonials/sarah.jpg"
  },
  {
    name: "Raj Patel",
    country: "Canada",
    university: "University of Toronto",
    program: "Computer Science",
    rating: 5,
    text: "The team at Flyover helped me navigate the complex visa process seamlessly. Their attention to detail and constant support gave me confidence throughout my journey to Canada.",
    image: "/testimonials/raj.jpg"
  },
  {
    name: "Emma Chen",
    country: "Australia",
    university: "University of Melbourne",
    program: "Medicine",
    rating: 5,
    text: "From application to arrival, Flyover was with me every step of the way. Their expertise in Australian education system and visa requirements was exceptional. Highly recommended!",
    image: "/testimonials/emma.jpg"
  },
  {
    name: "Ahmed Hassan",
    country: "UK",
    university: "Oxford University",
    program: "Engineering",
    rating: 5,
    text: "Flyover's counselors are truly professional and knowledgeable. They helped me secure admission to Oxford and guided me through the entire process with patience and expertise.",
    image: "/testimonials/ahmed.jpg"
  },
  {
    name: "Maria Rodriguez",
    country: "Germany",
    university: "Technical University of Munich",
    program: "Data Science",
    rating: 5,
    text: "The scholarship guidance I received from Flyover was outstanding. They helped me secure a full scholarship for my Master's program in Germany. Forever grateful!",
    image: "/testimonials/maria.jpg"
  },
  {
    name: "David Kim",
    country: "New Zealand",
    university: "University of Auckland",
    program: "Business Administration",
    rating: 5,
    text: "Flyover's comprehensive support system is unmatched. From university selection to visa approval, they made the entire process smooth and stress-free.",
    image: "/testimonials/david.jpg"
  }
];

const stats = [
  { icon: Users, label: "Students Placed", value: "22,000+" },
  { icon: Globe, label: "Countries", value: "50+" },
  { icon: Award, label: "Success Rate", value: "98%" },
  { icon: Quote, label: "5-Star Reviews", value: "15,000+" }
];

export default function TestimonialsPage() {
  return (
    <div>
      <PageHeader 
        title="Student Success Stories" 
        subtitle="Over 22,000 students have achieved their dreams with our expert guidance. Read their inspiring journeys." 
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
            {stats.map((stat, index) => {
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
          
          <Slider autoplayMs={8000}>
            {[0, 1].map((slideIndex) => (
              <div key={slideIndex} className="px-2">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {testimonials.slice(slideIndex * 3, (slideIndex + 1) * 3).map((testimonial, index) => (
                    <Reveal key={index} delay={index * 0.1}>
                      <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                            <p className="text-sm text-gray-600">{testimonial.program} • {testimonial.university}</p>
                            <p className="text-sm text-brand-600 font-medium">{testimonial.country}</p>
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
