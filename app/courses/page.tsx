import type { Metadata } from "next";

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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Popular Courses</h1>
      <p className="mt-3 text-gray-700 max-w-2xl">Explore study areas and destinations. Submit a program enquiry to get personalized options.</p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((c) => (
          <li key={c} className="card p-5">
            <div className="text-lg font-semibold text-gray-900">{c}</div>
            <div className="mt-1 text-sm text-gray-700">Overview and career pathways (content-managed).</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
