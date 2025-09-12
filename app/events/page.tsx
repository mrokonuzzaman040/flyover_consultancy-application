import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import EventsGrid from "@/components/events-grid";

export const metadata: Metadata = {
  title: "Events | Flyover Consultancy",
};

export default function EventsPage() {
  const events = [
    { date: "Jan 20, 2025", city: "Dhaka", title: "Study Abroad Fair", status: "upcoming" },
    { date: "Feb 10, 2025", city: "Chittagong", title: "Visa Workshop", status: "upcoming" },
    { date: "Aug 12, 2024", city: "Dhaka", title: "Scholarship Seminar", status: "past" },
  ];

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Register for upcoming seminars, fairs and information sessions."
        image="/hero/slide2.svg"
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <EventsGrid items={events as { date: string; city: string; title: string; status: "upcoming" | "past" }[]} />
      </div>
    </div>
  );
}
