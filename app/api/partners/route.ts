import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Partner from '../../../lib/models/Partner';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const partners = await Partner.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}