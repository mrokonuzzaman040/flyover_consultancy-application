import type { Metadata } from "next";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import Slider from "@/components/ui/slider";
import StarRating from "@/components/ui/star-rating";

export const metadata: Metadata = {
  title: "Testimonials | Flyover Consultancy",
};

export default function TestimonialsPage() {
  return (
    <div>
      <PageHeader title="Testimonials" subtitle="22,000+ success stories across the globe." image="/hero/slide3.svg" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Slider autoplayMs={7000}>
          {[0, 1].map((s) => (
            <div key={s} className="px-1">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Reveal key={i} delay={i * 0.03}>
                    <blockquote className="card p-5 bg-white">
                      <StarRating value={5} />
                      <p className="mt-2 text-gray-800">“Helpful counselors. Smooth admission and visa process.”</p>
                      <footer className="mt-3 text-sm text-gray-600">Student Name</footer>
                    </blockquote>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
