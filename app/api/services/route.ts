import { NextRequest, NextResponse } from "next/server";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Service } from "@/lib/models/Service";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const popular = searchParams.get('popular');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');
    
    let query = {};
    
    // Filter by popular services if requested
    if (popular === 'true') {
      query = { ...query, popular: true };
    }
    
    // Add text search if provided
    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    let servicesQuery = Service.find(query).sort({ createdAt: -1 });
    
    // Apply limit if provided
    if (limit && !isNaN(parseInt(limit))) {
      servicesQuery = servicesQuery.limit(parseInt(limit));
    }
    
    const docs = await servicesQuery.lean();
    
    return NextResponse.json({ 
      services: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })),
      count: docs.length
    });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}