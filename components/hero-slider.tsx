"use client";
import Image from "next/image";
import Link from "next/link";
import Slider from "@/components/ui/slider";
import CtaButton from "@/components/cta-button";
import Reveal from "@/components/ui/reveal";

type Slide = {
  image: string;
  headline: string;
  sub: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

const slides: Slide[] = [
  {
    image: "/hero/slide1.svg",
    headline: "Your Global Study Partner",
    sub: "Admissions, visas, scholarships and more — end-to-end guidance.",
    primary: { label: "Book Free Consultation", href: "/book-consultation" },
    secondary: { label: "Explore Destinations", href: "/destinations" },
  },
  {
    image: "/hero/slide2.svg",
    headline: "550+ Institutions, 22,000+ Success Stories",
    sub: "Unlock top universities across AU, CA, USA, UK, EU, NZ, JP.",
    primary: { label: "See Services", href: "/services" },
    secondary: { label: "Upcoming Events", href: "/events" },
  },
  {
    image: "/hero/slide3.svg",
    headline: "Start in 5 Simple Steps",
    sub: "From counseling to takeoff — we streamline your journey.",
    primary: { label: "Start Now", href: "/book-consultation" },
    secondary: { label: "Read Resources", href: "/resources" },
  },
];

export default function HeroSlider() {
  return (
    <div className="relative">
      <Slider autoplayMs={6000} className="h-[520px] sm:h-[560px] md:h-[600px]" itemClassName="relative">
        {slides.map((s, i) => (
          <div key={i} className="relative h-full w-full">
            <Image
              src={s.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            {/* dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0">
              <div className="mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                <Reveal>
                  <div className="max-w-2xl text-white">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl drop-shadow">{s.headline}</h1>
                    <p className="mt-4 text-lg text-white/90">{s.sub}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {s.primary ? (
                        <CtaButton href={s.primary.href}>{s.primary.label}</CtaButton>
                      ) : null}
                      {s.secondary ? (
                        <Link
                          href={s.secondary.href}
                          className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
                        >
                          {s.secondary.label}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

