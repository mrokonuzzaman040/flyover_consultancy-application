import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectDB();
    const collection = db.collection('blogs');
    
    // Fetch only published blogs, sorted by publishedAt date (newest first)
    const blogs = await collection
      .find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      blogs: blogs
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}