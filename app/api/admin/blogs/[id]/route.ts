import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import { Blog } from '../../../../../lib/models/Blog';
import { z } from 'zod';
import { ObjectId } from 'mongodb';

const updateBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  excerpt: z.string().min(1, 'Excerpt is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  author: z.string().min(1, 'Author is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  tags: z.array(z.string()).optional(),
  image: z.string().url('Invalid image URL').optional(),
  featuredImage: z.string().url('Invalid featured image URL').optional(),
  featured: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  slug: z.string().optional(),
  readTime: z.string().optional()
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

// GET /api/admin/blogs/[id] - Get single blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectDB();
    
    const blog = await db.collection('blogs').findOne({ _id: new ObjectId(id) });
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog: {
        ...blog,
        _id: blog._id.toString()
      }
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blogs/[id] - Update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateBlogSchema.parse(body);

    const { db } = await connectDB();
    
    // Check if blog exists
    const existingBlog = await db.collection('blogs').findOne({ _id: new ObjectId(id) });
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    const updateData: Partial<Blog> & { updatedAt: Date } = {
      ...validatedData,
      updatedAt: new Date()
    };

    // Generate new slug if title is updated
    if (validatedData.title && validatedData.title !== existingBlog.title) {
      const baseSlug = generateSlug(validatedData.title);
      let slug = baseSlug;
      let counter = 1;
      
      while (await db.collection('blogs').findOne({ slug, _id: { $ne: new ObjectId(id) } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    // Recalculate read time if content is updated
    if (validatedData.content) {
      updateData.readTime = calculateReadTime(validatedData.content);
    }

    // Update publishedAt if status changes to published
    if (validatedData.status === 'published' && existingBlog.status !== 'published') {
      updateData.publishedAt = new Date().toISOString();
    }

    const result = await db.collection('blogs').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    const updatedBlog = await db.collection('blogs').findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      blog: {
        ...updatedBlog,
        _id: updatedBlog!._id.toString()
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blogs/[id] - Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectDB();
    
    const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}