import { NextRequest, NextResponse } from "next/server";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Scholarship } from "@/lib/models/Scholarship";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    const query: { status: string; $or?: Array<{ title?: { $regex: string; $options: string }; description?: { $regex: string; $options: string } }> } = { status: 'published' };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const scholarships = await Scholarship.find(query)
      .select('title slug description country deadline amount eligibility requirements applicationProcess website tags')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return NextResponse.json({ 
      scholarships: scholarships.map(scholarship => toObject(scholarship as { _id: unknown })) 
    });
  } catch (error: unknown) {
    console.error('Error fetching scholarships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scholarships' },
      { status: 500 }
    );
  }
}