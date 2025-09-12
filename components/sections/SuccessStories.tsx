"use client";

import Slider from "@/components/ui/slider";
import StarRating from "@/components/ui/star-rating";

const testimonials = [
  {
    rating: 5,
    text: "Helpful counselors and a smooth visa process. Highly recommend!",
    author: "Student Name"
  },
  {
    rating: 5,
    text: "Excellent guidance throughout my application process. Made my dream come true!",
    author: "Another Student"
  },
  {
    rating: 5,
    text: "Professional service and great support. Got into my top choice university!",
    author: "Happy Graduate"
  }
];

export default function SuccessStories() {
  return (
    <section className="section-muted">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          22,000+ Success Stories — You could be the next
        </h2>
        <Slider className="mt-6" autoplayMs={6000}>
          {[0, 1].map((s) => (
            <div key={s} className="px-1">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial, i) => (
                  <div key={i} className="card p-5 bg-white">
                    <StarRating value={testimonial.rating} />
                    <p className="mt-2 text-sm text-gray-700">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div className="mt-3 text-sm font-medium text-gray-900">
                      {testimonial.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}