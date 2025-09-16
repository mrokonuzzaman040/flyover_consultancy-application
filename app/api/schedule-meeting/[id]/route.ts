import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import ScheduleMeeting from "@/lib/models/ScheduleMeeting";

// Validation schema for updating meeting
const updateMeetingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  scheduledDateTime: z.string().datetime().optional(),
  message: z.string().max(1000).optional(),
  preferredService: z.enum(['study-consultation', 'application-support', 'visa-assistance', 'course-selection', 'general-inquiry']).optional(),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional()
});

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if we're in build mode or if MongoDB is not available
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { meeting: null, error: 'Database not available during build' },
        { status: 503 }
      );
    }

    await dbConnect();
    const { id } = await params;
    
    const meeting = await ScheduleMeeting.findById(id).lean();
    
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    
    return NextResponse.json({ meeting: toObject(meeting as { _id: unknown }) });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return NextResponse.json({ error: "Failed to fetch meeting" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = await params;
    
    const validationResult = updateMeetingSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;
    
    // If updating scheduledDateTime, validate it's in the future
    if (updateData.scheduledDateTime) {
      const scheduledDate = new Date(updateData.scheduledDateTime);
      const now = new Date();
      
      if (scheduledDate <= now) {
        return NextResponse.json(
          { error: "Scheduled date must be in the future" },
          { status: 400 }
        );
      }
      
      (updateData as any).scheduledDateTime = scheduledDate;
    }
    
    const meeting = await ScheduleMeeting.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
    
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Meeting updated successfully", 
      meeting: toObject(meeting as { _id: unknown }) 
    });
  } catch (error) {
    console.error('Error updating meeting:', error);
    return NextResponse.json({ error: "Failed to update meeting" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const meeting = await ScheduleMeeting.findByIdAndDelete(id).lean();
    
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Meeting deleted successfully", 
      meeting: toObject(meeting as { _id: unknown }) 
    });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return NextResponse.json({ error: "Failed to delete meeting" }, { status: 500 });
  }
}
