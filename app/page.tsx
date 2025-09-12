import CtaButton from "@/components/cta-button";
import LeadForm from "@/components/lead-form";
import Link from "next/link";
import Reveal from "@/components/ui/reveal";
import AnimatedCounter from "@/components/ui/animated-counter";
import FloatingCta from "@/components/ui/floating-cta";
import HeroOrbs from "@/components/ui/hero-orbs";
import HeroSlider from "@/components/hero-slider";
import Slider from "@/components/ui/slider";
import StarRating from "@/components/ui/star-rating";

export default function Home() {
  return (
    <div>
      {/* 1. Hero (image + text slider) */}
      <HeroSlider />

      {/* 2. How Flyover Simplifies your Study Abroad Journey */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">How Flyover Simplifies Your Study Abroad Journey</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Personalized Counseling", desc: "Program and country matching, scholarship guidance." },
            { title: "Application Excellence", desc: "SOP review, documentation and submissions." },
            { title: "Offer & GTE Support", desc: "Offer acceptance, CAS/COE, compliance." },
            { title: "Visa Assistance", desc: "Checklists, filing and interview preparation." },
            { title: "Accommodation & Insurance", desc: "Pre-departure essentials sorted." },
            { title: "Onshore Support", desc: "Alumni community and settling-in tips." },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <div className="card p-5">
                <div className="text-lg font-semibold text-gray-900">{f.title}</div>
                <p className="mt-1 text-sm text-gray-700">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3. Gain Access to Top Institutions across the Globe */}
      <section className="section-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Gain Access to Top Institutions across the Globe</h2>
          <p className="mt-2 text-gray-700">Trusted pathways to 550+ universities and colleges.</p>
          <div className="mt-6 overflow-x-auto no-scrollbar">
            <div className="flex min-w-max gap-4">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="flex h-16 w-40 items-center justify-center rounded-md border bg-white text-sm font-semibold text-gray-700">
                  Partner {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Study abroad in just 5 steps */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Study Abroad in Just 5 Steps</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { t: "Book consultation" },
            { t: "Shortlist programs" },
            { t: "Apply & get offers" },
            { t: "Visa approval" },
            { t: "Fly & settle" },
          ].map((s, i) => (
            <li key={i} className="card p-5">
              <div className="text-3xl font-extrabold text-brand">{i + 1}</div>
              <div className="mt-2 text-gray-900 font-semibold">{s.t}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. Why Choose Us */}
      <section className="section-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Why Choose Us</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["End-to-end FREE assistance", "22,000+ success stories", "550+ global partners", "Transparent, ethical guidance"].map((t, i) => (
              <div key={i} className="card p-5">
                <div className="text-gray-900 font-semibold">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Awards & achievements */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Awards & Achievements</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="text-gray-900 font-semibold">Award Title {i + 1}</div>
              <p className="mt-1 text-sm text-gray-700">Recognition for excellence in student services.</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Upcoming Events */}
      <section className="section-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Upcoming Events</h2>
            <Link href="/events" className="text-sm font-semibold text-brand">View all</Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <article key={i} className="card p-5">
                <div className="text-sm text-gray-500">Jan {i + 10}, 2025 • Dhaka</div>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">Study Abroad Fair</h3>
                <p className="mt-1 text-sm text-gray-700">Meet university representatives and explore scholarships.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Our Industry Partnerships */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Industry Partnerships</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex h-16 items-center justify-center rounded-md border bg-white text-sm font-semibold text-gray-700">
              Partner {i + 1}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Success Stories — review slider */}
      <section className="section-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">22,000+ Success Stories — You could be the next</h2>
          <Slider className="mt-6" autoplayMs={6000}>
            {[0, 1].map((s) => (
              <div key={s} className="px-1">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="card p-5 bg-white">
                      <StarRating value={5} />
                      <p className="mt-2 text-sm text-gray-700">“Helpful counselors and a smooth visa process. Highly recommend!”</p>
                      <div className="mt-3 text-sm font-medium text-gray-900">Student Name</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* 10. Insights to Keep You Ahead */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Insights to Keep You Ahead</h2>
          <Link href="/resources" className="text-sm font-semibold text-brand">View all</Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <article key={i} className="card p-5">
              <div className="text-sm text-gray-500">Author • 5 min read</div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">Latest Article {i}</h3>
              <p className="mt-1 text-sm text-gray-700">Short excerpt from the latest resource article.</p>
            </article>
          ))}
        </div>
      </section>

      {/* 11. Contact Us */}
      <section className="section-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-start gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Contact Us</h2>
              <p className="mt-2 text-gray-700">Have questions? Send us an enquiry and a counselor will get back to you.</p>
              <div className="mt-6">
                <LeadForm purpose="enquiry" />
              </div>
            </div>
            <div className="card p-5">
              <h3 className="text-lg font-semibold text-gray-900">Offices</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>Dhaka — +880-000-000000</li>
                <li>Chittagong — +880-000-000000</li>
              </ul>
              <div className="mt-4 aspect-video w-full bg-gray-100" aria-hidden />
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA */}
      <FloatingCta />
    </div>
  );
}
