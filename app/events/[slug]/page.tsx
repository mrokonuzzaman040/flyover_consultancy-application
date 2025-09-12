import type { Metadata } from "next";

export const metadata: Metadata = { title: "Event | Flyover" };

export default function EventDetailPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-sm text-gray-500">Jan 20, 2025 • Dhaka</div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">Study in Australia Fair</h1>
      <div className="mt-6 card p-5">
        <p className="text-gray-700">Event details and agenda. Registration form will appear here.</p>
      </div>
    </div>
  );
}
