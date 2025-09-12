"use client";
import Link from "next/link";
import { useState } from "react";
import CtaButton from "@/components/cta-button";
import Image from "next/image";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/destinations", label: "Destinations" },
  { href: "/courses", label: "Courses" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/resources", label: "Resources" },
  { href: "/events", label: "Events" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand/15 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Flyover Consultancy" width={128} height={128} />
            <span className="sr-only">Flyover Consultancy</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-gray-800 hover:text-brand transition-colors font-medium">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden md:block">
          <CtaButton />
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-brand/10 transition-colors"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-brand/15 bg-white shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="grid gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-3 text-gray-800 hover:bg-brand/10 hover:text-brand transition-colors font-medium"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <CtaButton className="w-full justify-center" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
