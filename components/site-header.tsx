"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import CtaButton from "@/components/cta-button";
import Image from "next/image";

const nav = [
  {
    label: "About Us",
    href: "/about",
    dropdown: [
      { href: "/about", label: "Our Story" },
      { href: "/about#team", label: "Our Team" },
      { href: "/about#mission", label: "Mission & Vision" },
      { href: "/testimonials", label: "Testimonials" },
    ],
  },
  {
    label: "Destinations",
    href: "/destinations",
    dropdown: [
      { href: "/destinations", label: "All Destinations" },
      { href: "/destinations/usa", label: "USA" },
      { href: "/destinations/canada", label: "Canada" },
      { href: "/destinations/uk", label: "United Kingdom" },
      { href: "/destinations/australia", label: "Australia" },
    ],
  },
  {
    label: "Our Services",
    href: "/services",
    dropdown: [
      { href: "/services", label: "All Services" },
      { href: "/services/study-consultation", label: "Study Consultation" },
      { href: "/services/visa-assistance", label: "Visa Assistance" },
      { href: "/services/application-support", label: "Application Support" },
      { href: "/services/course-selection", label: "Course Selection" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    dropdown: [
      { href: "/resources", label: "All Resources" },
      { href: "/resources/study-guides", label: "Study Guides" },
      { href: "/resources/application-tips", label: "Application Tips" },
      { href: "/events", label: "Events & Webinars" },
      { href: "/resources/faq", label: "FAQ" },
    ],
  },
  {
    label: "Scholarships",
    href: "/scholarships",
    dropdown: [
      { href: "/scholarships", label: "All Scholarships" },
      { href: "/scholarships/undergraduate", label: "Undergraduate" },
      { href: "/scholarships/graduate", label: "Graduate" },
      { href: "/scholarships/phd", label: "PhD Programs" },
      { href: "/scholarships/merit", label: "Merit-based" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay before closing
    setCloseTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand/15 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Flyover Consultancy" width={128} height={128} />
            <span className="sr-only">Flyover Consultancy</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {nav.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 text-gray-800 hover:text-brand transition-colors font-medium py-2"
              >
                {item.label}
                {item.dropdown && (
                  <svg
                    className="h-4 w-4 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>
              
              {item.dropdown && activeDropdown === item.label && (
                <div 
                  className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="py-2">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.href}
                        href={dropdownItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand/10 hover:text-brand transition-colors"
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
                <div key={item.label}>
                  {item.dropdown ? (
                    <div>
                      <button
                        className="flex w-full items-center justify-between rounded-md px-3 py-3 text-gray-800 hover:bg-brand/10 hover:text-brand transition-colors font-medium text-left"
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                      >
                        {item.label}
                        <svg
                          className={`h-4 w-4 transition-transform duration-200 ${
                            activeDropdown === item.label ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {activeDropdown === item.label && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-brand/10 hover:text-brand transition-colors"
                              onClick={() => setOpen(false)}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block rounded-md px-3 py-3 text-gray-800 hover:bg-brand/10 hover:text-brand transition-colors font-medium"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
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
