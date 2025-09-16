import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import LeadForm from "@/components/lead-form";

export const metadata: Metadata = {
  title: "Scholarships | Flyover Consultancy",
};

export default function ScholarshipsPage() {
  return (
    <div>
      <PageHeader
        title="Scholarships"
        subtitle="Guidance on university and government scholarships across Australia, Canada, USA, UK, Europe, New Zealand and Japan."
        image="/hero/slide1.svg"
      />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg card p-5">
          <h2 className="text-lg font-bold text-brand">Get Scholarship Advice</h2>
          <p className="mt-2 text-sm text-gray-700">Submit your details and our counselor will reach out.</p>
          <div className="mt-4">
            <LeadForm purpose="enquiry" />
          </div>
        </div>
      </div>
    </div>
  );
}
