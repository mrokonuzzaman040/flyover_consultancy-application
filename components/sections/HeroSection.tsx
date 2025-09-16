"use client";

import HeroSlider from "@/components/hero-slider";
import { ISlide } from "@/lib/types/homepage";

interface HeroSectionProps {
  slides?: ISlide[];
}

export default function HeroSection({ slides }: HeroSectionProps) {
  return (
    <section className="relative">
      <HeroSlider slides={slides} />
    </section>
  );
}