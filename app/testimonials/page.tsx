import type { Metadata } from "next";
import Reveal from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Testimonials | Flyover Consultancy",
};

export default function TestimonialsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">What Students Say</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Reveal key={i} delay={i * 0.03}>
            <blockquote className="card p-5">
              <p className="text-gray-800">“Helpful counselors. Smooth admission and visa process.”</p>
              <footer className="mt-3 text-sm text-gray-600">Student Name</footer>
            </blockquote>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
