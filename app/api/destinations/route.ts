import { NextRequest, NextResponse } from "next/server";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Destination } from "@/lib/models/Destination";

export async function GET() {
  try {
    // Check if we're in build mode or if MongoDB is not available
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { destinations: [], error: 'Database not available during build' },
        { status: 503 }
      );
    }

    await dbConnect();
    const docs = await Destination.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ destinations: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    // Handle MongoDB connection errors gracefully during build
    if (e instanceof Error && e.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { destinations: [], error: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Generate next ID
    const lastDestination = await Destination.findOne({}).sort({ id: -1 }).lean() as { id: number } | null;
    const nextId = lastDestination ? lastDestination.id + 1 : 1;
    
    const destinationData = {
      ...body,
      id: nextId
    };
    
    const destination = new Destination(destinationData);
    await destination.save();
    
    return NextResponse.json({ 
      message: "Destination created successfully", 
      destination: toObject(destination as { _id: unknown }) 
    }, { status: 201 });
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create destination" }, { status: 500 });
  }
}