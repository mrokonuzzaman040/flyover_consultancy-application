"use client";
import { PhoneCall, Calendar } from "lucide-react";
import Link from "next/link";

export default function FloatingCta() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a
        href="tel:+880000000000"
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand shadow-lg ring-1 ring-black/5 hover:shadow-xl"
        aria-label="Call Flyover"
      >
        <PhoneCall className="h-4 w-4" /> Call Us
      </a>
      <Link
        href="/book-consultation"
        className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold shadow-lg text-brand ring-1 ring-brand/30 hover:bg-brand-700"
        aria-label="Book a free consultation"
        target="_blank"
      >
        <Calendar className="h-4 w-4 text-white" /> Free Consultation
      </Link>
    </div>
  );
}

