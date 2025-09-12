import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import CtaButton from "@/components/cta-button";

export const metadata: Metadata = {
  title: "Services | Flyover Consultancy",
  description: "Admission, visa, accommodation, health insurance, migration services.",
};

export default function ServicesPage() {
  const services = [
    { href: "/services/admission-support", title: "Admission Support", desc: "Shortlisting, SOP guidance, applications, offers." },
    { href: "/services/visa-services", title: "Visa Services", desc: "Document checklist, submission, interview prep." },
    { href: "/services/accommodation", title: "Accommodation", desc: "On/near campus options and partners." },
    { href: "/services/health-insurance", title: "Health Insurance", desc: "Student coverage guidance and enrollment." },
    { href: "/services/migration", title: "Migration Services", desc: "Migration advisory for Australia (lead capture)." },
  ];

  return (
    <div>
      <PageHeader
        title="Our Services"
        subtitle="End-to-end support for your study abroad journey."
        image="/hero/slide2.svg"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.href} delay={i * 0.05}>
            <Link href={s.href} className="card p-5 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-700">{s.desc}</p>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mt-8 rounded-lg bg-brand/5 p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900">Ready to get started?</h2>
          <p className="mt-1 text-gray-700">Book a free consultation with our counselors.</p>
          <div className="mt-4 flex justify-center"><CtaButton /></div>
        </div>
      </div>
    </div>
  );
}
