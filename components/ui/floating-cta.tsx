"use client";
import { Calendar } from "lucide-react";
import Link from "next/link";

export default function FloatingCta() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <Link
        href="/book-consultation"
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-lg ring-1 ring-brand/30 hover:bg-brand-700 text-brand"
        aria-label="Book a free consultation"
        target="_blank"
      >
        <Calendar className="h-4 w-4 text-brand" /> Free Consultation
      </Link>
    </div>
  );
}

