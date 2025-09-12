import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scholarships | Flyover Consultancy",
};

export default function ScholarshipsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Scholarships</h1>
      <p className="mt-3 text-gray-700">
        Guidance on university and government scholarships across Australia, Canada, USA, UK, Europe, New Zealand and Japan.
      </p>
      <div className="mt-8 rounded-lg border p-5">
        <h2 className="text-lg font-semibold">Get Scholarship Advice</h2>
        <p className="mt-2 text-sm text-gray-700">Submit your details and our counselor will reach out.</p>
        {/* Scholarship enquiry form added later (reuses LeadForm) */}
      </div>
    </div>
  );
}

