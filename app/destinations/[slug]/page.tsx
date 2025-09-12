import type { Metadata } from "next";
import { notFound } from "next/navigation";

const COUNTRIES = {
  australia: {
    title: "Study in Australia",
    overview:
      "World-class universities, post-study work opportunities, and diverse student life.",
  },
  canada: {
    title: "Study in Canada",
    overview: "High-quality education with welcoming immigration pathways.",
  },
  usa: {
    title: "Study in USA",
    overview: "Top-ranked universities with broad program options and research.",
  },
  uk: { title: "Study in UK", overview: "Historic institutions and 1-year masters programs." },
  europe: { title: "Study in Europe", overview: "Schengen access and varied tuition options." },
  "new-zealand": { title: "Study in New Zealand", overview: "Safe, beautiful, and innovation-focused." },
  japan: { title: "Study in Japan", overview: "Tech-forward with unique culture and scholarships." },
} as const;

type Params = { params: { slug: keyof typeof COUNTRIES } };

export function generateMetadata({ params }: Params): Metadata {
  const country = COUNTRIES[params.slug];
  if (!country) return { title: "Destination" };
  return { title: `${country.title} | Flyover Consultancy` };
}

export default function DestinationPage({ params }: Params) {
  const data = COUNTRIES[params.slug];
  if (!data) return notFound();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">{data.title}</h1>
      <p className="mt-3 text-gray-700 max-w-3xl">{data.overview}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-lg font-semibold">Top Universities & Highlights</h2>
          <p className="mt-2 text-sm text-gray-700">Coming soon via Admin CMS.</p>
        </section>
        <section className="card p-5">
          <h2 className="text-lg font-semibold">Intakes & Timeline</h2>
          <p className="mt-2 text-sm text-gray-700">Common intakes and when to apply.</p>
        </section>
        <section className="card p-5">
          <h2 className="text-lg font-semibold">Cost of Study</h2>
          <p className="mt-2 text-sm text-gray-700">Tuition and living estimates.</p>
        </section>
        <section className="card p-5">
          <h2 className="text-lg font-semibold">Scholarships</h2>
          <p className="mt-2 text-sm text-gray-700">Popular scholarships and eligibility.</p>
        </section>
        <section className="md:col-span-2 card p-5">
          <h2 className="text-lg font-semibold">Visa Overview & FAQs</h2>
          <p className="mt-2 text-sm text-gray-700">Visa basics and common questions.</p>
        </section>
      </div>
    </div>
  );
}
