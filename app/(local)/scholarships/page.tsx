"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, MapPin, Award, ArrowRight } from "lucide-react";
// Simple date formatter
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
import PageHeader from "@/components/page-header";
import LeadForm from "@/components/lead-form";

interface Scholarship {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  country: string[];
  deadline?: string;
  createdAt: string;
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);

  useEffect(() => {
    fetchScholarships();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = scholarships.filter(
        (scholarship) =>
          scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          scholarship.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          scholarship.country.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredScholarships(filtered);
    } else {
      setFilteredScholarships(scholarships);
    }
  }, [searchTerm, scholarships]);

  const fetchScholarships = async () => {
    try {
      const response = await fetch('/api/scholarships?limit=50');
      if (!response.ok) throw new Error('Failed to fetch scholarships');
      const data = await response.json();
      setScholarships(data.scholarships || []);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Scholarships"
          subtitle="Guidance on university and government scholarships across Australia, Canada, USA, UK, Europe, New Zealand and Japan."
          image="/hero/slide1.svg"
        />
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Scholarships"
        subtitle="Guidance on university and government scholarships across Australia, Canada, USA, UK, Europe, New Zealand and Japan."
        image="/hero/slide1.svg"
      />
      
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search scholarships by name, country, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-2 rounded-xl focus:border-blue-500 focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Scholarships Grid */}
        {filteredScholarships.length === 0 ? (
          <div className="text-center py-16">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'No scholarships found' : 'No scholarships available'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or browse all scholarships.'
                : 'Check back later for new scholarship opportunities.'}
            </p>
            {searchTerm && (
              <Button 
                onClick={() => setSearchTerm('')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {searchTerm ? `Found ${filteredScholarships.length} scholarships` : 'Available Scholarships'}
              </h2>
              <p className="text-gray-600">
                {searchTerm 
                  ? `Showing results for "${searchTerm}"`
                  : 'Explore funding opportunities for your education journey'}
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
              {filteredScholarships.map((scholarship) => (
                <Card key={scholarship._id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        <Award className="w-3 h-3 mr-1" />
                        Scholarship
                      </Badge>
                      {scholarship.deadline && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(scholarship.deadline)}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {scholarship.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {scholarship.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {scholarship.description}
                      </p>
                    )}
                    
                    {scholarship.country.length > 0 && (
                      <div className="flex items-center mb-4">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {scholarship.country.slice(0, 3).map((country, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {country}
                            </Badge>
                          ))}
                          {scholarship.country.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{scholarship.country.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <Link href={`/scholarships/${scholarship.slug}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group-hover:shadow-lg transition-all duration-300">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Lead Form Section */}
        <div className="rounded-lg card p-5">
          <h2 className="text-lg font-bold text-brand">Get Scholarship Advice</h2>
          <p className="mt-2 text-sm text-gray-700">Submit your details and our counselor will reach out.</p>
          <div className="mt-4">
            <LeadForm purpose="enquiry" />
          </div>
        </div>
      </div>
    </div>
  );
}
