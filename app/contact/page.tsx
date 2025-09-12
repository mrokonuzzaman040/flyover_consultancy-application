import type { Metadata } from "next";
import LeadForm from "@/components/lead-form";
import Reveal from "@/components/ui/reveal";

export const metadata: Metadata = { title: "Contact Us | Flyover Consultancy" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contact Us</h1>
      <p className="mt-3 text-gray-700">Reach our offices and submit a general enquiry.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Reveal>
          <div className="card p-5">
            <h2 className="text-lg font-semibold">Offices</h2>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li>Dhaka — +880-000-000000</li>
              <li>Chittagong — +880-000-000000</li>
            </ul>
            <div className="mt-4 aspect-video w-full bg-gray-100" aria-hidden />
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="card p-5">
            <h2 className="text-lg font-semibold">General Enquiry</h2>
            <p className="mt-2 text-sm text-gray-700">Form connects to /api/leads.</p>
            <div className="mt-4">
              <LeadForm purpose="enquiry" />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
