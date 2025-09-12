"use client";

import FloatingCta from "@/components/ui/floating-cta";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import DestinationsSlider from "@/components/sections/DestinationsSlider";
import StudyAbroadSteps from "@/components/sections/StudyAbroadSteps";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import AwardsSection from "@/components/sections/AwardsSection";
import UpcomingEvents from "@/components/sections/UpcomingEvents";
import PartnershipsSection from "@/components/sections/PartnershipsSection";
import SuccessStories from "@/components/sections/SuccessStories";
import InsightsSection from "@/components/sections/InsightsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {

  return (
    <div>
      {/* 1. Hero (image + text slider) */}
      <HeroSection />

      {/* How Flyover Simplifies Your Study Abroad Journey */}
      <ServicesSection />

      {/* 3. Gain Access to Top Institutions across the Globe */}
      <DestinationsSlider />

      {/* 4. Study abroad in just 5 steps - Professional Infographic */}
      <StudyAbroadSteps />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Awards & achievements */}
      <AwardsSection />

      {/* 7. Upcoming Events */}
      <UpcomingEvents />

      {/* 8. Our Industry Partnerships */}
      <PartnershipsSection />

      {/* 9. Success Stories — review slider */}
      <SuccessStories />

      {/* 10. Insights to Keep You Ahead */}
      <InsightsSection />

      {/* 11. Contact Us */}
      <ContactSection />

      {/* Floating CTA */}
      <FloatingCta />
    </div>
  );
}
