import { NextRequest, NextResponse } from "next/server";
import { dbConnect, toObject } from "@/lib/mongoose";
import Event from "@/lib/models/Event";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    // Query parameters for filtering
    const eventType = searchParams.get("eventType");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const upcoming = searchParams.get("upcoming");
    const search = searchParams.get("search");
    
    // Build query for published events only (or events without status field)
    const query: Record<string, unknown> = {
      $or: [
        { status: "published" },
        { status: { $exists: false } } // Include events without status field
      ]
    };
    
    // Add filters
    if (eventType) {
      query.eventType = eventType;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (featured === "true") {
      query.featured = true;
    }
    
    if (upcoming === "true") {
      // Only show events that haven't started yet
      // For now, include all events since legacy data doesn't have proper date formats
      // TODO: Update this when events have proper startAt dates
      query.$or = [
        { startAt: { $gt: new Date() } },
        { startAt: { $exists: false } } // Include events without startAt (legacy events)
      ];
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }
    
    // Execute query with pagination
    const events = await Event.find(query)
      .sort({ 
        featured: -1, // Featured events first
        startAt: 1,   // Then by start date
        createdAt: -1 // Then by creation date
      })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const total = await Event.countDocuments(query);
    
    // Transform data to ensure consistent format
    const transformedEvents = events.map((event, index) => {
      const transformed = toObject(event as { _id: unknown });
      
      // Ensure required fields are present
      if (!transformed.id) {
        transformed.id = transformed._id || `event-${index + 1}`;
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
      
      return transformed;
    });
    
    return NextResponse.json({
      events: transformedEvents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
