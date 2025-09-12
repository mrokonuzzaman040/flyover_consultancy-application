import type { Metadata } from "next";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Resources | Flyover Consultancy",
  description: "Guides, tips, and news about studying abroad.",
};

export default function ResourcesIndexPage() {
  return (
    <div>
      <PageHeader
        title="Resources"
        subtitle="Guides, tips and news about studying abroad. Use the filters to find content quickly."
        image="/hero/slide3.svg"
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="card p-4">
          <form className="grid gap-3 sm:grid-cols-3">
            <input className="rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Search keywords" />
            <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="">All countries</option>
              <option>Australia</option>
              <option>Canada</option>
              <option>USA</option>
              <option>UK</option>
              <option>Europe</option>
              <option>New Zealand</option>
              <option>Japan</option>
            </select>
            <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="">Any date</option>
              <option>Last 30 days</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </form>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Reveal key={i} delay={i * 0.05}>
              <article className="card p-5 hover:shadow-md transition-shadow">
                <div className="text-sm text-gray-500">Author • 5 min read</div>
                <h2 className="mt-2 text-lg font-semibold">Sample Article {i}</h2>
                <p className="mt-1 text-sm text-gray-700">Article excerpt. Content managed via Admin.</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
