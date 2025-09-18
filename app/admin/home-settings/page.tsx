"use client"

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/admin/PageHeader";
import { 
  Sliders, 
  Award, 
  Building2, 
  TrendingUp, 
  BookOpen, 
  Star, 
  Heart,
  Calendar,
  FileText,
  Users
} from "lucide-react";

export default function HomeSettingsPage() {
  const router = useRouter();

  const settingsItems = [
    {
      title: "Hero Slider",
      description: "Manage homepage slider content and images",
      icon: Sliders,
      href: "/admin/home-settings/slider",
      color: "bg-blue-500"
    },
    {
      title: "Awards & Achievements",
      description: "Manage company awards and recognitions",
      icon: Award,
      href: "/admin/home-settings/awards",
      color: "bg-yellow-500"
    },
    {
      title: "Partners",
      description: "Manage partner organizations and institutions",
      icon: Building2,
      href: "/admin/home-settings/partners",
      color: "bg-green-500"
    },
    {
      title: "Statistics",
      description: "Manage company statistics and achievements",
      icon: TrendingUp,
      href: "/admin/home-settings/stats",
      color: "bg-purple-500"
    },
    {
      title: "Study Abroad Steps",
      description: "Manage the step-by-step process for studying abroad",
      icon: BookOpen,
      href: "/admin/home-settings/study-abroad-steps",
      color: "bg-indigo-500"
    },
    {
      title: "Success Stories",
      description: "Manage student success stories and testimonials",
      icon: Star,
      href: "/admin/home-settings/success-stories",
      color: "bg-emerald-500"
    },
    {
      title: "Why Choose Us Features",
      description: "Manage features that highlight why students should choose your services",
      icon: Heart,
      href: "/admin/home-settings/why-choose-us-features",
      color: "bg-pink-500"
    },
    {
      title: "Events",
      description: "Manage upcoming events and webinars",
      icon: Calendar,
      href: "/admin/events",
      color: "bg-orange-500"
    },
    {
      title: "Insights",
      description: "Manage blog posts and educational content",
      icon: FileText,
      href: "/admin/home-settings/insights",
      color: "bg-teal-500"
    },
    {
      title: "Services",
      description: "Manage service offerings and descriptions",
      icon: Users,
      href: "/admin/services",
      color: "bg-cyan-500"
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Home Settings"
        description="Manage homepage content and sections using individual models"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(item.href)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(item.href);
                  }}
                >
                  Manage
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
