"use client";

import LeadForm from "@/components/lead-form";
import { IContactInfo } from "@/lib/types/homepage";

const defaultOffices = [
  {
    city: "Dhaka",
    phone: "+8801703666064"
  },
  {
    city: "Chittagong",
    phone: "+8801310338691"
  }
];

interface ContactSectionProps {
  contactInfo?: IContactInfo | null;
}

export default function ContactSection({ contactInfo }: ContactSectionProps) {
  // Create office-like structure from contact info or use defaults
  const offices = contactInfo?.phones?.map((phone: string, index: number) => ({
    city: index === 0 ? contactInfo.city || "Dhaka" : "Chittagong",
    phone
  })) || defaultOffices;
  return (
    <section className="section-muted">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-start gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Contact Us
            </h2>
            <p className="mt-2 text-gray-700">
              Have questions? Send us an enquiry and a counselor will get back to you.
            </p>
            <div className="mt-6">
              <LeadForm purpose="enquiry" />
            </div>
          </div>
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-900">Offices</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {offices.map((office, index) => (
                <li key={index}>
                  {office.city} — {office.phone}
                </li>
              ))}
            </ul>
            <div className="mt-4 aspect-video w-full bg-gray-100" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}