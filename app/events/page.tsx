import type { Metadata } from "next";
import Reveal from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Events | Flyover Consultancy",
};

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Events</h1>
      <p className="mt-3 text-gray-700 max-w-2xl">Register for upcoming seminars, fairs, and information sessions.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2].map((i) => (
          <Reveal key={i} delay={i * 0.05}>
            <article className="card p-5 hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-500">Jan {i + 10}, 2025 • Dhaka</div>
              <h2 className="mt-2 text-lg font-semibold">Study in Australia Fair</h2>
              <p className="mt-1 text-sm text-gray-700">Meet university reps and explore scholarships.</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
