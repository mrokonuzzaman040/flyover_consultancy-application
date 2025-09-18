import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { db } = await connectDB();
    const collection = db.collection('blogs');
    
    // Find the blog by slug and ensure it's published
    const blog = await collection.findOne({ 
      slug: slug,
      status: 'published'
    });
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      blog: blog
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}