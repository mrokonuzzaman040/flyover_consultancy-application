import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import Reveal from "@/components/ui/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blogs | Flyover Consultancy",
  description: "Read our latest insights, tips, and success stories about studying abroad. Get expert advice on university applications, visa processes, and student life.",
  keywords: "study abroad blog, university tips, visa guides, student success stories, education insights",
};

export const dynamic = "force-dynamic";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  publishedAt: string;
  readTime: string;
  status: string;
};

const categories = [
  "All Categories",
  "Study Guides",
  "Scholarships",
  "Visa Guides",
  "Success Stories",
  "University Tips",
  "Financial Planning"
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function getBlogs(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blogs`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.blogs || [];
  } catch (error) {
    return [];
  }
}

export default async function BlogsPage() {
  const blogPosts = await getBlogs();
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Our Blog"
        subtitle="Stay updated with the latest trends in international education, expert advice, and inspiring student success stories."
        image="/hero/slide2.svg"

      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Filter */}
        <Reveal>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All Categories" ? "default" : "outline"}
                  className={category === "All Categories" ? "bg-brand-600 hover:bg-brand-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* No Posts Message */}
        {blogPosts.length === 0 && (
          <Reveal>
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Blog Posts Available</h2>
              <p className="text-gray-600">Check back later for new articles and insights.</p>
            </div>
          </Reveal>
        )}

        {/* Featured Post */}
        {blogPosts.length > 0 && (
          <Reveal>
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="h-64 md:h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center overflow-hidden">
                      {blogPosts[0]?.featuredImage ? (
                        <Image
                          src={blogPosts[0].featuredImage} 
                          alt={blogPosts[0].title}
                          className="w-full h-full object-cover"
                          width={400}
                          height={300}
                        />
                      ) : (
                        <div className="text-brand-600 text-6xl font-bold opacity-20">FEATURED</div>
                      )}
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary" className="bg-brand-100 text-brand-700">
                        {blogPosts[0]?.category}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {blogPosts[0]?.publishedAt && formatDate(blogPosts[0].publishedAt)}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2">
                      {blogPosts[0]?.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {blogPosts[0]?.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        {blogPosts[0]?.author}
                        <Clock className="w-4 h-4 ml-4 mr-1" />
                        {blogPosts[0]?.readTime}
                      </div>
                      <Link href={`/blogs/${blogPosts[0]?.slug}`}>
                        <Button className="bg-brand-600 hover:bg-brand-700">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Reveal>
        )}

        {/* Blog Posts Grid */}
        {blogPosts.length > 1 && (
          <Reveal>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.slice(1).map((post: BlogPost) => (
                <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    {post.featuredImage ? (
                      <Image
                        width={400}
                        height={300}
                        src={post.featuredImage} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-gray-400 text-4xl font-bold opacity-30">{post.category.toUpperCase()}</div>
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="w-3 h-3 mr-1" />
                        {post.author}
                        <Clock className="w-3 h-3 ml-3 mr-1" />
                        {post.readTime}
                      </div>
                      <Link href={`/blogs/${post.slug}`}>
                        <Button variant="ghost" size="sm" className="text-brand-600 hover:text-brand-700 p-0">
                          Read More
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Reveal>
        )}

        {/* Load More Button */}
        <Reveal>
          <div className="text-center">
            <Button variant="outline" size="lg" className="border-brand-200 text-brand-600 hover:bg-brand-50">
              Load More Articles
            </Button>
          </div>
        </Reveal>

        {/* Newsletter Signup */}
        <Reveal>
          <div className="mt-20">
            <Card className="bg-gradient-to-r from-brand-50 to-brand-100 border-brand-200">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Stay Updated with Our Latest Insights
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Subscribe to our newsletter and get the latest study abroad tips, scholarship opportunities, and success stories delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  <Button className="bg-brand-600 hover:bg-brand-700 whitespace-nowrap">
                    Subscribe Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
