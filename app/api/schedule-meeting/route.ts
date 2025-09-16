import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import ScheduleMeeting from "@/lib/models/ScheduleMeeting";

// Validation schema
const scheduleMeetingSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100, "Full name too long"),
  phoneNumber: z.string().min(1, "Phone number is required").max(20, "Phone number too long"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  scheduledDateTime: z.string().datetime("Invalid date format"),
  message: z.string().max(1000, "Message too long").optional(),
  preferredService: z.enum(['study-consultation', 'application-support', 'visa-assistance', 'course-selection', 'general-inquiry']).optional(),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('LOW')
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Validate the request body
    const validationResult = scheduleMeetingSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validationResult.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if the scheduled date is in the future
    const scheduledDate = new Date(data.scheduledDateTime);
    const now = new Date();
    
    if (scheduledDate <= now) {
      return NextResponse.json(
        { error: "Scheduled date must be in the future" },
        { status: 400 }
      );
    }

    // Check for conflicting meetings (optional - you might want to prevent double booking)
    const conflictingMeeting = await ScheduleMeeting.findOne({
      scheduledDateTime: {
        $gte: new Date(scheduledDate.getTime() - 30 * 60 * 1000), // 30 minutes before
        $lte: new Date(scheduledDate.getTime() + 30 * 60 * 1000)  // 30 minutes after
      },
      status: { $in: ['PENDING', 'CONFIRMED'] }
    });

    if (conflictingMeeting) {
      return NextResponse.json(
        { error: "There's already a meeting scheduled around this time. Please choose a different time." },
        { status: 409 }
      );
    }

    // Create the meeting
    const meetingData = {
      ...data,
      scheduledDateTime: scheduledDate,
      email: data.email || undefined, // Convert empty string to undefined
      preferredService: data.preferredService || undefined
    };

    const meeting = await ScheduleMeeting.create(meetingData);
    
    // Here you could add email notification logic
    // await sendMeetingConfirmationEmail(meeting);
    
    return NextResponse.json(
      { 
        message: "Meeting scheduled successfully", 
        meeting: toObject(meeting.toObject()) 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('Error scheduling meeting:', error);
    
    // Handle duplicate key errors
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: "A meeting with similar details already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to schedule meeting. Please try again." },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve meetings (for admin purposes)
export async function GET(req: NextRequest) {
  try {
    // Check if we're in build mode or if MongoDB is not available
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { meetings: [], error: 'Database not available during build' },
        { status: 503 }
      );
    }

    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    // Build query
    const query: { status?: string } = {};
    if (status) {
      query.status = status;
    }
    // Get meetings with pagination
    const meetings = await ScheduleMeeting.find(query)
      .sort({ scheduledDateTime: 1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    
    const total = await ScheduleMeeting.countDocuments(query);
    
    return NextResponse.json({
      meetings: meetings.map(meeting => toObject(meeting as { _id: unknown })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}