import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import EventRegistration from "@/lib/models/EventRegistration";
import mongoose from "mongoose";

// Validation schema for updating registration
const updateRegistrationSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'attended', 'no-show']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded', 'failed']).optional(),
  paymentAmount: z.number().min(0).optional(),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
  checkedInAt: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
  checkedInBy: z.string().optional(),
  notes: z.string().max(1000, "Notes too long").optional(),
  // Allow updating user details
  fullName: z.string().min(1).max(100).optional(),
  phone: z.string().min(1).max(20).optional(),
  company: z.string().max(100).optional(),
  jobTitle: z.string().max(100).optional(),
  country: z.string().max(50).optional(),
  city: z.string().max(50).optional(),
  dietaryRequirements: z.string().max(200).optional(),
  accessibilityNeeds: z.string().max(200).optional(),
  emergencyContact: z.object({
    name: z.string().min(1).max(100),
    phone: z.string().min(1).max(20),
    relationship: z.string().min(1).max(50)
  }).optional(),
  howDidYouHear: z.string().max(100).optional(),
  expectations: z.string().max(500).optional(),
  questions: z.string().max(500).optional(),
});

function validateId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!validateId(id)) {
      return NextResponse.json({ error: "Invalid registration ID" }, { status: 400 });
    }

    const registration = await EventRegistration.findById(id).lean();
    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ registration: toObject(registration as { _id: unknown }) });
  } catch (error) {
    console.error("Error fetching registration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!validateId(id)) {
      return NextResponse.json({ error: "Invalid registration ID" }, { status: 400 });
    }

    const body = await request.json();
    const validationResult = updateRegistrationSchema.safeParse(body);
    
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const errorMessage = Object.values(fieldErrors).flat().join(', ') || 'Validation failed';
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    const registration = await EventRegistration.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ registration: toObject(registration as { _id: unknown }) });
  } catch (error) {
    console.error("Error updating registration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!validateId(id)) {
      return NextResponse.json({ error: "Invalid registration ID" }, { status: 400 });
    }

    const registration = await EventRegistration.findByIdAndDelete(id).lean();
    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    // If registration was confirmed, increment seats remaining for the event
    if ((registration as any).status === 'confirmed' || (registration as any).status === 'pending') {
      const Event = (await import("@/lib/models/Event")).default;
      await Event.findByIdAndUpdate((registration as any).eventId, {
        $inc: { seatsRemaining: 1 }
      });
    }

    return NextResponse.json({ message: "Registration deleted successfully" });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
