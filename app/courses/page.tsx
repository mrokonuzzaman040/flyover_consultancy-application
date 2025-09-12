import type { Metadata } from "next";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Courses | Flyover Consultancy",
};

const COURSES = [
  "Nursing",
  "Accounting",
  "Information Technology",
  "Engineering",
  "Business & Management",
  "Data Science",
  "Hospitality & Tourism",
];

export default function CoursesPage() {
  return (
    <div>
      <PageHeader
        title="Popular Courses"
        subtitle="Explore study areas and destinations. Submit a program enquiry to get personalized options."
        image="/hero/slide3.svg"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c) => (
            <li key={c} className="card p-5">
              <div className="text-lg font-semibold text-gray-900">{c}</div>
              <div className="mt-1 text-sm text-gray-700">Overview and career pathways (content-managed).</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
