"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "@/components/ui/slider";
import CtaButton from "@/components/cta-button";
import Reveal from "@/components/ui/reveal";
import ScheduleMeetingModal from "@/components/modals/ScheduleMeetingModal";
import heroSlidesData from "@/data/sections-data.json";

type Slide = {
  image: string;
  headline: string;
  sub: string;
  primary?: { label: string; href?: string; isModal?: boolean };
  secondary?: { label: string; href: string };
};



interface HeroSliderProps {
  slides?: Slide[];
}

export default function HeroSlider({ slides = heroSlidesData.slides }: HeroSliderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleScheduleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl drop-shadow-lg">{s.headline}</h1>
                    <p className="mt-4 text-base sm:text-lg text-white/90 drop-shadow">{s.sub}</p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      {s.primary ? (
                        s.primary.isModal ? (
                          <button
                            onClick={handleScheduleClick}
                            className="inline-flex items-center justify-center rounded-md bg-brand-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg hover:bg-brand-700 transition-all duration-200 drop-shadow"
                          >
                            {s.primary.label}
                          </button>
                        ) : (
                          <CtaButton href={s.primary.href} className="text-sm sm:text-base px-6 py-3">{s.primary.label}</CtaButton>
                        )
                      ) : null}
                      {s.secondary ? (
                        <Link
                          href={s.secondary.href}
                          className="inline-flex items-center justify-center rounded-md border-2 border-white/40 bg-white/15 px-6 py-3 text-sm sm:text-base font-semibold text-white backdrop-blur hover:bg-white/25 transition-all duration-200 drop-shadow"
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
      
      <ScheduleMeetingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

