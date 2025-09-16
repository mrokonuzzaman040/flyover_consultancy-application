import { NextRequest, NextResponse } from "next/server";
import { dbConnect, toObject } from "@/lib/mongoose";
import Event from "@/lib/models/Event";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect();
    const { slug } = await params;
    
    // Find event by slug, only published events (or events without status field)
    const event = await Event.findOne({ 
      slug: slug,
      $or: [
        { status: "published" },
        { status: { $exists: false } } // Include events without status field
      ]
    }).lean();
    
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }
    
    // Transform data to ensure consistent format
    const transformed = toObject(event as { _id: unknown });
    
    // Ensure required fields are present
    if (!transformed.id) {
      transformed.id = transformed._id;
    }
    
    // Ensure boolean fields are properly set
    transformed.featured = transformed.featured || false;
    transformed.isFree = transformed.isFree !== false; // Default to true if not set
    
    // Ensure capacity and seats remaining are numbers
    if (transformed.capacity && typeof transformed.capacity === 'string') {
      transformed.capacity = parseInt(transformed.capacity);
    }
    if (transformed.seatsRemaining && typeof transformed.seatsRemaining === 'string') {
      transformed.seatsRemaining = parseInt(transformed.seatsRemaining);
    }
    
    // Ensure price is a number
    if (transformed.price && typeof transformed.price === 'string') {
      transformed.price = parseFloat(transformed.price);
    }
    
    // Set default currency if not present
    if (!transformed.currency) {
      transformed.currency = 'USD';
    }
    
    return NextResponse.json({ event: transformed });
    
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}
