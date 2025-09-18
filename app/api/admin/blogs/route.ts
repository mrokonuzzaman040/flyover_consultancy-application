import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { Blog } from '../../../../lib/models/Blog';
import { z } from 'zod';
import { ObjectId, WithId, Document } from 'mongodb';

const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()),
  image: z.string().url('Invalid image URL'),
  featuredImage: z.string().url('Invalid featured image URL').optional(),
  featured: z.boolean(),
  status: z.enum(['draft', 'published'])
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// GET /api/admin/blogs - Get all blogs
export async function GET() {
  try {
    const { db } = await connectDB();
    const blogs = await db.collection('blogs')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ 
      success: true, 
      blogs: blogs.map((blog: WithId<Document>) => ({
        ...blog,
        _id: blog._id.toString()
      }))
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/admin/blogs - Create new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createBlogSchema.parse(body);

    const { db } = await connectDB();
    
    // Generate unique slug
    const baseSlug = generateSlug(validatedData.title);
    let slug = baseSlug;
    let counter = 1;
    
    while (await db.collection('blogs').findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const blogData: Blog = {
      ...validatedData,
      id: generateUniqueId(),
      slug,
      readTime: calculateReadTime(validatedData.content),
      publishedAt: validatedData.status === 'published' ? new Date().toISOString() : '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Remove _id field before insertion as MongoDB will generate it
    const { _id, ...blogDataForInsert } = blogData;
    const result = await db.collection('blogs').insertOne(blogDataForInsert);

    return NextResponse.json({
      success: true,
      blog: {
        ...blogData,
        _id: result.insertedId.toString()
      }
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}