"use client";
import Reveal from "@/components/ui/reveal";
import { useState } from "react";

type EventItem = { date: string; city: string; title: string; status: "upcoming" | "past" };

export default function EventsGrid({ items }: { items: EventItem[] }) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const filtered = items.filter((e) => e.status === tab);
  return (
    <div>
      <div className="flex gap-2">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md border px-3 py-1.5 text-sm ${tab === t ? "bg-brand text-white border-brand" : "bg-white text-gray-700"}`}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e, i) => (
          <Reveal key={`${e.title}-${i}`} delay={i * 0.05}>
            <article className="card p-5 hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-500">{e.date} • {e.city}</div>
              <h2 className="mt-2 text-lg font-semibold">{e.title}</h2>
              <p className="mt-1 text-sm text-gray-700">Meet university reps and explore scholarships.</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

