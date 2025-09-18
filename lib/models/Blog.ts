export interface Blog {
  _id?: string;
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  image: string;
  featuredImage?: string;
  featured: boolean;
  readTime: string;
  status: 'draft' | 'published' | 'archived';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBlogRequest {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  featuredImage?: string;
  featured: boolean;
  status: 'draft' | 'published';
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {
  slug?: string;
  readTime?: string;
}

export const blogCategories = [
  'Study Guides',
  'Scholarships', 
  'Visa Guides',
  'Success Stories',
  'University Tips',
  'Financial Planning',
  'Study Abroad',
  'Cultural Adaptation'
] as const;

export type BlogCategory = typeof blogCategories[number];