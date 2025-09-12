import type { Metadata } from "next";
import LeadForm from "@/components/lead-form";

export const metadata: Metadata = {
  title: "Book a Free Consultation | Flyover Consultancy",
};

export default function BookConsultationPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Book a Free Consultation</h1>
      <p className="mt-3 text-gray-700">We’ll contact you to confirm time and counselor.</p>
      <div className="mt-6 rounded-lg border p-5">
        <LeadForm purpose="consultation" />
      </div>
    </div>
  );
}
