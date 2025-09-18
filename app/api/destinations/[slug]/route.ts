import { NextRequest, NextResponse } from "next/server";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Destination } from "@/lib/models/Destination";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    // Check if we're in build mode or if MongoDB is not available
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { destination: null, error: 'Database not available during build' },
        { status: 503 }
      );
    }

    await dbConnect();
    const { slug } = await params;
    const destination = await Destination.findOne({ slug }).lean();
    
    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }
    
    return NextResponse.json({ destination: toObject(destination as { _id: unknown }) });
  } catch (e: unknown) {
    // Handle MongoDB connection errors gracefully during build
    if (e instanceof Error && e.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { destination: null, error: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch destination" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect();
    const body = await request.json();
    const { slug } = await params;
    
    const destination = await Destination.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();
    
    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Destination updated successfully", 
      destination: toObject(destination as { _id: unknown }) 
    });
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update destination" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    await dbConnect();
    const body = await request.json();
    
    const destination = await Destination.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();
    
    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Destination updated successfully", 
      destination: toObject(destination as { _id: unknown }) 
    });
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update destination" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect();
    const { slug } = await params;
    
    const destination = await Destination.findOneAndDelete({ slug }).lean();
    
    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Destination deleted successfully", 
      destination: toObject(destination as { _id: unknown }) 
    });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete destination" }, { status: 500 });
  }
}