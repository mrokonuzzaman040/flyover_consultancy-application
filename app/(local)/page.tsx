"use client";

import { useHomepageData } from "@/lib/hooks/useHomepageData";
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
  const { data, loading, error } = useHomepageData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  console.log(data.successStories);

  return (
    <div>
      {/* 1. Hero (image + text slider) */}
      <HeroSection slides={data.slides} />

      {/* How Flyover Simplifies Your Study Abroad Journey */}
      <ServicesSection 
        services={data.services?.map(service => ({
          icon: 'UserCheck', // Default icon since IService doesn't have icon
          title: service.name,
          description: service.description,
          features: service.features?.map(f => f.title) || [],
          popular: service.popular || false
        }))}
        stats={data.stats?.map(stat => ({
          icon: stat.icon,
          value: stat.value,
          label: stat.label
        }))}
      />

      {/* 3. Gain Access to Top Institutions across the Globe */}
      <DestinationsSlider 
        destinations={data.destinations?.map(dest => ({
          name: dest.name,
          city: dest.country, // Using country as city
          image: dest.image,
          universityLogo: dest.image, // Using same image for now
          description: dest.description
        }))}
      />

      {/* 4. Study abroad in just 5 steps - Professional Infographic */}
      <StudyAbroadSteps 
        steps={data.studyabroadsteps?.map((step) => ({
          stepId: step.stepId,
          title: step.title,
          description: step.description,
          color: step.color,
          bgColor: step.bgColor,
          textColor: step.textColor,
          icon: step.icon
        }))}
      />

      {/* 5. Why Choose Us */}
      <WhyChooseUs 
        features={data.whychooseusfeatures?.map(feature => ({
          icon: feature.icon,
          title: feature.title,
          description: feature.description,
          stat: '100+', // Default stat
          statLabel: 'Success Rate' // Default stat label
        }))}
      />

      {/* 6. Awards & achievements */}
      <AwardsSection awards={data.awards} />

      {/* 7. Upcoming Events */}
      <UpcomingEvents />

      {/* 8. Our Industry{/* 8. Partnerships */}
      <PartnershipsSection 
        partners={data.partners?.map((partner, index) => ({
          id: index + 1,
          name: partner.name,
          category: partner.category,
          country: 'Global', // Default country
          logo: partner.logo,
          color: '#6366F1' // Default indigo color
        }))}
      />
      {/* 9. Success Stories — review slider */}
      <SuccessStories 
        successStories={data.successStories?.map((story, index) => ({
          id: index + 1,
          rating: story.rating,
          text: story.text,
          author: story.author,
          university: 'University Name', // Default university
          program: 'Study Program', // Default program
          country: story.country,
          scholarship: story.scholarship,
          year: story.year,
          avatar: story.avatar,
          flag: story.flag,
          color: story.color
        }))}
      />

      {/* 10. Insights to Keep You Ahead */}
      <InsightsSection 
        insights={data.insights?.map((insight, index) => ({
          id: index + 1,
          category: insight.category,
          categoryColor: insight.categoryColor,
          author: insight.author,
          authorRole: insight.authorRole,
          readTime: insight.readTime,
          publishDate: insight.publishDate,
          title: insight.title,
          excerpt: insight.excerpt,
          image: insight.image,
          featured: insight.featured,
          views: insight.views,
          likes: insight.likes
        }))}
      />

      {/* 11. Contact Us */}
      <ContactSection contactInfo={data.contactInfo} />

      {/* Floating CTA */}
      <FloatingCta />
    </div>
  );
}
