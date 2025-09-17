import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Clock, User, ArrowLeft, Share2, BookOpen, Eye, Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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

export const dynamic = 'force-dynamic'

// Generate static params for build time
export async function generateStaticParams() {
  try {
    const blogs = await getAllBlogs()
    return blogs.map((blog) => ({
      slug: blog.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getAllBlogs(): Promise<BlogPost[]> {
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
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching blogs:', error);
    }
    return [];
  }
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | Flyover Education',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: `${post.title} | Flyover Education`,
    description: post.excerpt,
    keywords: post.tags?.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blogs/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.blog || null;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching blog:', error);
    }
    return null;
  }
}

async function getRelatedPosts(currentSlug: string, category: string): Promise<BlogPost[]> {
  const blogs = await getAllBlogs();
  return blogs
    .filter((post: BlogPost) => post.slug !== currentSlug && post.category === category)
    .slice(0, 3)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative container mx-auto px-4 py-16">
          {/* Back Navigation */}
          <Link href="/blogs">
            <Button variant="ghost" className="mb-8 text-white hover:bg-white/10 border-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Button>
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              {post.category}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              {post.title}
            </h1>
            <p className="text-xl md:text-2xl text-brand-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              {post.excerpt}
            </p>
            
            {/* Article Meta */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-brand-200 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-brand-400 to-brand-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>Article</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button className="bg-white text-brand-900 hover:bg-gray-100">
                <Share2 className="h-4 w-4 mr-2" />
                Share Article
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Heart className="h-4 w-4 mr-2" />
                Save for Later
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative -mt-16 z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
                <Image
                  width={1000}
                  height={600}
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Reading Progress Indicator */}
          <div className="sticky top-4 z-20 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>Reading</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                   <div className="bg-gradient-to-r from-brand-500 to-brand-600 h-2 rounded-full w-[30%]"></div>
                 </div>
                <span className="text-xs font-medium">{post.readTime}</span>
              </div>
            </div>
          </div>

          <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-12">
              {/* Article Content */}
              <div className="prose prose-xl max-w-none">
                <div 
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: post.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>').replace(/^/, '<p>').replace(/$/, '</p>')
                      .replace(/## (.*?)(<br>|<\/p>)/g, '<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6 pb-2 border-b-2 border-brand-100">$1</h2>')
                      .replace(/### (.*?)(<br>|<\/p>)/g, '<h3 class="text-2xl font-semibold text-gray-900 mt-10 mb-4">$1</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>')
                      .replace(/- (.*?)(<br>|<\/p>)/g, '<li class="mb-2">$1</li>')
                      .replace(/(<li.*<\/li>)/g, '<ul class="list-none my-6 space-y-3 pl-0">$1</ul>')
                      .replace(/<li class="mb-2">/g, '<li class="mb-2 flex items-start"><span class="inline-block w-2 h-2 bg-brand-500 rounded-full mt-3 mr-3 flex-shrink-0"></span><span>')
                      .replace(/<\/li>/g, '</span></li>')
                      .replace(/\d+\. (.*?)(<br>|<\/p>)/g, '<li class="mb-2">$1</li>')
                      .replace(/(<li.*\d+\. .*<\/li>)/g, '<ol class="list-decimal list-inside my-6 space-y-3 pl-4">$1</ol>')
                      .replace(/<p>/g, '<p class="mb-6 text-lg leading-8">')
                  }}
                />
              </div>

              {/* Article Footer */}
              <div className="mt-16 pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{post.author}</p>
                      <p className="text-sm text-gray-600">Content Writer</p>
                    </div>
                  </div>

                  {/* Social Actions */}
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="hover:bg-brand-50 border-brand-200 text-brand-700 hover:text-brand-800">
                      <Heart className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-brand-50 border-brand-200 text-brand-700 hover:text-brand-800">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-brand-50 border-brand-200 text-brand-700 hover:text-brand-800">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                  <Button variant="outline" className="flex-1 border-brand-200 text-brand-700 hover:bg-brand-50 hover:text-brand-800">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous Post
                  </Button>
                  <Button variant="outline" className="flex-1 border-brand-200 text-brand-700 hover:bg-brand-50 hover:text-brand-800">
                    Next Post
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-4 py-2 bg-gradient-to-r from-brand-50 to-brand-100 text-gray-700 hover:from-brand-100 hover:to-brand-200 transition-all duration-200 cursor-pointer">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-brand-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Continue Reading
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover more insights and tips to help you on your study abroad journey
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <Card key={relatedPost._id} className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 shadow-lg bg-white overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-video bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 flex items-center justify-center overflow-hidden">
                        {relatedPost.featuredImage ? (
                          <>
                            <Image 
                              src={relatedPost.featuredImage} 
                              width={400}
                              height={300}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20"></div>
                          </>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="relative z-10 text-center text-white">
                              <div className="text-5xl font-bold mb-2 opacity-90">
                                {relatedPost.category.charAt(0)}
                              </div>
                              <div className="text-sm font-medium opacity-80">
                                {relatedPost.category}
                              </div>
                            </div>
                          </>
                        )}
                        <div className="absolute top-4 right-4 z-20">
                          <Badge className="bg-white/20 text-white border-white/30">
                            #{index + 1}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-8">
                        <Badge variant="secondary" className="mb-4 bg-brand-50 text-brand-700">
                          {relatedPost.category}
                        </Badge>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-brand-600 transition-colors leading-tight">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                          {relatedPost.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-brand-400 to-brand-500 rounded-full flex items-center justify-center">
                              <User className="h-3 w-3 text-white" />
                            </div>
                            <span className="font-medium">{relatedPost.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{relatedPost.readTime}</span>
                          </div>
                        </div>
                        
                        <Link href={`/blogs/${relatedPost.slug}`}>
                          <Button className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                            Read Full Article
                            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden border-0 shadow-2xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
            
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
