import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Destinations | Flyover Consultancy",
  description: "Study in Australia, Canada, USA, UK, Europe, New Zealand, Japan.",
};

const countries = [
  { slug: "australia", name: "Australia" },
  { slug: "canada", name: "Canada" },
  { slug: "usa", name: "USA" },
  { slug: "uk", name: "UK" },
  { slug: "europe", name: "Europe" },
  { slug: "new-zealand", name: "New Zealand" },
  { slug: "japan", name: "Japan" },
];

export default function DestinationsPage() {
  return (
    <div>
      <PageHeader
        title="Destinations"
        subtitle="Choose your dream country and explore universities, costs, visas, intakes and more."
        image="/hero/slide1.svg"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c, i) => (
            <li key={c.slug}>
              <Reveal delay={i * 0.05}>
                <Link href={`/destinations/${c.slug}`} className="block card p-5 hover:shadow-md transition-shadow">
                  <div className="text-lg font-semibold text-gray-900">Study in {c.name}</div>
                  <div className="mt-1 text-sm text-gray-700">Overview, top universities, scholarships, visa basics.</div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
