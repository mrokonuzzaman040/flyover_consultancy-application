import type { Metadata } from "next";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = { title: "About Us | Flyover Consultancy" };

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="About Us"
        subtitle="Helping students pursue international education with transparent, end-to-end guidance."
        image="/hero/slide2.svg"
      />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-2">
        <Reveal>
          <section className="card p-5">
            <h2 className="text-lg font-semibold">Mission</h2>
            <p className="mt-2 text-sm text-gray-700">Empower students with accurate information and end-to-end assistance.</p>
          </section>
        </Reveal>
        <Reveal delay={0.05}>
          <section className="card p-5">
            <h2 className="text-lg font-semibold">Leadership</h2>
            <p className="mt-2 text-sm text-gray-700">Leadership profiles will be editable from Admin.</p>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
