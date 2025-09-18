"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Award, ExternalLink, Clock, Users, DollarSign } from "lucide-react";
import LeadForm from "@/components/lead-form";

// Simple date formatter
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

interface Scholarship {
  id: string;
  title: string;
  slug: string;
  description?: string;
  country: string[];
  deadline?: string;
  amount?: string;
  eligibility?: string;
  requirements?: string;
  applicationProcess?: string;
  website?: string;
  createdAt?: string;
}

interface ScholarshipDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ScholarshipDetailPage({ params }: ScholarshipDetailPageProps) {
  const { slug } = use(params);
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScholarship();
  }, [slug]);

  const fetchScholarship = async () => {
    try {
      const response = await fetch(`/api/scholarships/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          notFound();
        }
        throw new Error('Failed to fetch scholarship');
      }
      const data = await response.json();
      setScholarship(data.scholarship);
    } catch (error) {
      console.error('Error fetching scholarship:', error);
      setError('Failed to load scholarship details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8 animate-pulse" />
            <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Scholarship Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || 'The scholarship you are looking for does not exist or has been removed.'}
            </p>
            <Link href="/scholarships">
              <Button className="bg-brand-600 hover:bg-brand-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Scholarships
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/scholarships" className="inline-flex items-center text-brand-600 hover:text-brand-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scholarships
          </Link>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white p-8">
              <div className="flex items-start justify-between mb-4">
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  <Award className="w-3 h-3 mr-1" />
                  Scholarship
                </Badge>
                {scholarship.deadline && (
                  <div className="flex items-center text-white/90">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Deadline: {formatDate(scholarship.deadline)}</span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{scholarship.title}</h1>
              
              {/* Countries */}
              {scholarship.country.length > 0 && (
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <div className="flex flex-wrap gap-2">
                    {scholarship.country.map((country, index) => (
                      <Badge key={index} className="bg-white/20 text-white hover:bg-white/30">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Description */}
              {scholarship.description && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Scholarship</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">{scholarship.description}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Amount */}
                {scholarship.amount && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg">
                        <DollarSign className="w-5 h-5 mr-2 text-brand-600" />
                        Scholarship Amount
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{scholarship.amount}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Eligibility */}
                {scholarship.eligibility && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg">
                        <Users className="w-5 h-5 mr-2 text-brand-600" />
                        Eligibility Criteria
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{scholarship.eligibility}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Requirements */}
                {scholarship.requirements && (
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg">
                        <Award className="w-5 h-5 mr-2 text-brand-600" />
                        Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{scholarship.requirements}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Application Process */}
                {scholarship.applicationProcess && (
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg">
                        <Calendar className="w-5 h-5 mr-2 text-brand-600" />
                        Application Process
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{scholarship.applicationProcess}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {scholarship.website && (
                  <a 
                    href={scholarship.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white">
                      Visit Official Website
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                )}
                <Button 
                  variant="outline" 
                  className="flex-1 border-2 border-brand-600 text-brand-600 hover:bg-brand-50"
                  onClick={() => {
                    const element = document.getElementById('contact-form');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Get Guidance
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div id="contact-form" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Your Application?</h2>
            <p className="text-gray-600 mb-6">
              Our expert counselors can guide you through the application process and help increase your chances of success.
            </p>
            <LeadForm purpose="enquiry" />
          </div>
        </div>
      </div>
    </div>
  );
}
