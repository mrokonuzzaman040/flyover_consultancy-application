"use client";

import Link from "next/link";

export default function UpcomingEvents() {
  const events = [
    {
      date: "Jan 11, 2025",
      location: "Dhaka",
      title: "Study Abroad Fair",
      description: "Meet university representatives and explore scholarships."
    },
    {
      date: "Jan 12, 2025",
      location: "Dhaka", 
      title: "Study Abroad Fair",
      description: "Meet university representatives and explore scholarships."
    },
    {
      date: "Jan 13, 2025",
      location: "Dhaka",
      title: "Study Abroad Fair", 
      description: "Meet university representatives and explore scholarships."
    }
  ];

  return (
    <section className="section-muted">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Upcoming Events</h2>
          <Link href="/events" className="text-sm font-semibold text-brand">View all</Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <article key={i} className="card p-5">
              <div className="text-sm text-gray-500">{event.date} • {event.location}</div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">{event.title}</h3>
              <p className="mt-1 text-sm text-gray-700">{event.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}