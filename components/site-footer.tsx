import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="mt-16 bg-neutral-950 text-white">
      <div className="h-1 w-full bg-gradient-to-r from-brand via-brand-700 to-brand" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <img src="/logo.png" alt="Flyover Consultancy" className="h-9 w-auto brightness-0 invert" />
            <p className="mt-4 text-sm text-white/80">
              Flyover Consultancy provides end-to-end support for international students — from course selection and applications to visas and pre-departure.
            </p>
            <div className="mt-4 flex gap-3 text-white/90">
              <a href="#" aria-label="Facebook" className="hover:text-white"><Facebook className="h-5 w-5" /></a>
              <a href="#" aria-label="Instagram" className="hover:text-white"><Instagram className="h-5 w-5" /></a>
              <a href="#" aria-label="YouTube" className="hover:text-white"><Youtube className="h-5 w-5" /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Destinations</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/85">
              {[
                ["Australia", "/destinations/australia"],
                ["Canada", "/destinations/canada"],
                ["USA", "/destinations/usa"],
                ["UK", "/destinations/uk"],
                ["Europe", "/destinations/europe"],
                ["New Zealand", "/destinations/new-zealand"],
                ["Japan", "/destinations/japan"],
              ].map(([label, href]) => (
                <li key={String(href)}>
                  <Link href={String(href)} className="hover:underline">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Services</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/85">
              {[
                ["Admission Support", "/services/admission-support"],
                ["Visa Services", "/services/visa-services"],
                ["Accommodation", "/services/accommodation"],
                ["Health Insurance", "/services/health-insurance"],
                ["Migration Services", "/services/migration"],
              ].map(([label, href]) => (
                <li key={String(href)}>
                  <Link href={String(href)} className="hover:underline">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Stay in the loop</h3>
            <form className="mt-3 flex overflow-hidden rounded-md border border-white/15">
              <input type="email" placeholder="Your email" className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none" />
              <button type="button" className="bg-brand px-3 text-sm font-semibold">Subscribe</button>
            </form>
            <div className="mt-4 text-sm text-white/80">
              <div>Phone: +880-000-000000</div>
              <div>Email: info@flyover.example</div>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/70">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
            <div>© {new Date().getFullYear()} Flyover Consultancy. All rights reserved.</div>
            <div className="flex gap-4">
              <Link href="/legal/privacy" className="hover:underline">Privacy</Link>
              <Link href="/legal/terms" className="hover:underline">Terms</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
