import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import EventRegistration from "@/lib/models/EventRegistration";
import Event from "@/lib/models/Event";

// Validation schema for event registration
const registrationSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  fullName: z.string().min(1, "Full name is required").max(100, "Full name too long"),
  email: z.string().email("Invalid email format").max(100, "Email too long"),
  phone: z.string().min(1, "Phone number is required").max(20, "Phone number too long"),
  company: z.string().max(100, "Company name too long").optional(),
  jobTitle: z.string().max(100, "Job title too long").optional(),
  country: z.string().max(50, "Country name too long").optional(),
  city: z.string().max(50, "City name too long").optional(),
  dietaryRequirements: z.string().max(200, "Dietary requirements too long").optional(),
  accessibilityNeeds: z.string().max(200, "Accessibility needs too long").optional(),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required").max(100),
    phone: z.string().min(1, "Emergency contact phone is required").max(20),
    relationship: z.string().min(1, "Relationship is required").max(50)
  }).optional(),
  howDidYouHear: z.string().max(100, "Source too long").optional(),
  expectations: z.string().max(500, "Expectations too long").optional(),
  questions: z.string().max(500, "Questions too long").optional(),
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Validate the request body
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const errorMessage = Object.values(fieldErrors).flat().join(', ') || 'Validation failed';
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if event exists and is available for registration
    const event = await Event.findById(data.eventId);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if event is published
    if (event.status !== 'published') {
      return NextResponse.json(
        { error: "Event is not available for registration" },
        { status: 400 }
      );
    }

    // Check if registration deadline has passed
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      return NextResponse.json(
        { error: "Registration deadline has passed" },
        { status: 400 }
      );
    }

    // Check if event has capacity
    if (event.maxAttendees && event.seatsRemaining <= 0) {
      return NextResponse.json(
        { error: "Event is full" },
        { status: 400 }
      );
    }

    // Check for duplicate registration
    const existingRegistration = await EventRegistration.findOne({
      eventId: data.eventId,
      email: data.email
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 409 }
      );
    }

    // Create registration
    const registrationData = {
      ...data,
      eventTitle: event.title,
      registrationDate: new Date(),
      status: 'pending' as const,
      paymentStatus: event.isFree ? 'paid' as const : 'pending' as const,
      paymentAmount: event.price || 0
    };

    const registration = await EventRegistration.create(registrationData);

    // Update event seats remaining if applicable
    if (event.maxAttendees && event.seatsRemaining > 0) {
      await Event.findByIdAndUpdate(data.eventId, {
        $inc: { seatsRemaining: -1 }
      });
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Registration successful",
        registration: toObject(registration.toObject())
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating event registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const email = searchParams.get("email");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query: any = {};
    
    if (eventId) query.eventId = eventId;
    if (email) query.email = email;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [registrations, total] = await Promise.all([
      EventRegistration.find(query)
        .sort({ registrationDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      EventRegistration.countDocuments(query)
    ]);

    return NextResponse.json({
      registrations: registrations.map(reg => toObject(reg as { _id: unknown })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching event registrations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
