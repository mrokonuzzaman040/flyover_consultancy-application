"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useNavigation } from "@/hooks/use-navigation";

export default function SiteFooter() {
  const [isClient, setIsClient] = useState(false);
  const { navigationData, loading: navLoading } = useNavigation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Extract destinations and services from navigation data
  const destinationsNav = navigationData.find(item => item.label === 'Destinations');
  const servicesNav = navigationData.find(item => item.label === 'Our Services');
  const scholarshipsNav = navigationData.find(item => item.label === 'Scholarships');
  return (
    <footer className="mt-16 bg-neutral-950 text-white">
      <div className="h-1 w-full bg-gradient-to-r from-brand via-brand-700 to-brand" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-5">
          <div>
            <Image src="/logo.png" alt="Flyover Consultancy" className="h-9 w-auto brightness-0 invert" width={120} height={30} />
            <p className="mt-4 text-sm text-white/80">
              Flyover Consultancy provides end-to-end support for international students — from course selection and applications to visas and pre-departure.
            </p>
            <div className="mt-4 flex gap-3 text-white/90">
              <a href="https://www.facebook.com/flyoverconsultancy" aria-label="Facebook" className="hover:text-white" target="_blank" rel="noopener noreferrer"><Facebook className="h-5 w-5" /></a>
              <a href="https://www.instagram.com/flyover.consultancy/" aria-label="Instagram" className="hover:text-white" target="_blank" rel="noopener noreferrer"><Instagram className="h-5 w-5" /></a>
              <a href="#" aria-label="YouTube" className="hover:text-white"><Youtube className="h-5 w-5" /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Destinations</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/90">
              {navLoading ? (
                <li className="text-white/60">Loading destinations...</li>
              ) : destinationsNav?.dropdown ? (
                destinationsNav.dropdown.slice(0, 7).map((dest) => (
                  <li key={dest.href}>
                    <Link href={dest.href} className="hover:underline hover:text-white transition-colors">
                      {dest.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link href="/destinations" className="hover:underline hover:text-white transition-colors">
                    View All Destinations
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Services</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/90">
              {navLoading ? (
                <li className="text-white/60">Loading services...</li>
              ) : servicesNav?.dropdown ? (
                servicesNav.dropdown.slice(0, 6).map((service) => (
                  <li key={service.href}>
                    <Link href={service.href} className="hover:underline hover:text-white transition-colors">
                      {service.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link href="/services" className="hover:underline hover:text-white transition-colors">
                    View All Services
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Scholarships</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/90">
              {navLoading ? (
                <li className="text-white/60">Loading scholarships...</li>
              ) : scholarshipsNav?.dropdown ? (
                scholarshipsNav.dropdown.slice(0, 5).map((scholarship) => (
                  <li key={scholarship.href}>
                    <Link href={scholarship.href} className="hover:underline hover:text-white transition-colors">
                      {scholarship.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link href="/scholarships" className="hover:underline hover:text-white transition-colors">
                    View All Scholarships
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Stay in the loop</h3>
            {isClient ? (
              <form className="mt-3 flex overflow-hidden rounded-md border border-white/25">
                <input type="email" placeholder="Your email" className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-brand/50" />
                <button type="button" className="bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-700 transition-colors">Subscribe</button>
              </form>
            ) : (
              <div className="mt-3 flex overflow-hidden rounded-md border border-white/25">
                <div className="w-full bg-transparent px-3 py-2 text-sm text-white/60">Your email</div>
                <div className="bg-brand px-4 text-sm font-semibold text-white">Subscribe</div>
              </div>
            )}
            <div className="mt-4 text-sm text-white/85">
              <div>Phone: +8801703666064</div>
              <div>Email: info.flyoverconsultancy@gmail.com</div>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/15 pt-6 text-xs text-white/80">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
            <div>© {new Date().getFullYear()} Flyover Consultancy. All rights reserved.</div>
            <div className="flex gap-4">
              <Link href="/legal/privacy" className="hover:underline hover:text-white transition-colors">Privacy</Link>
              <Link href="/legal/terms" className="hover:underline hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:underline hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
