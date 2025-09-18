import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import Event from "@/lib/models/Event";

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().min(1).optional(),
  // Legacy fields
  date: z.string().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
  registrationLink: z.string().optional(),
  type: z.string().optional(),
  attendees: z.string().optional(),
  featured: z.boolean().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  // New fields
  startAt: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
  endAt: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
  venue: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published", "cancelled", "completed"]).optional(),
  capacity: z.number().int().nonnegative().optional(),
  seatsRemaining: z.number().int().nonnegative().optional(),
  // Enhanced fields
  eventType: z.enum(['workshop', 'seminar', 'conference', 'webinar', 'fair', 'exhibition', 'networking', 'other']).optional(),
  category: z.enum(['education', 'career', 'networking', 'training', 'information', 'other']).optional(),
  targetAudience: z.array(z.string()).optional(),
  organizer: z.string().optional(),
  organizerEmail: z.string().email().optional(),
  organizerPhone: z.string().optional(),
  price: z.number().min(0).optional(),
  currency: z.string().optional(),
  isFree: z.boolean().optional(),
  registrationDeadline: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
  maxAttendees: z.number().int().min(1).optional(),
  minAttendees: z.number().int().min(1).optional(),
  requirements: z.array(z.string()).optional(),
  agenda: z.array(z.object({
    time: z.string(),
    title: z.string(),
    description: z.string().optional(),
    speaker: z.string().optional()
  })).optional(),
  speakers: z.array(z.object({
    name: z.string(),
    title: z.string(),
    company: z.string().optional(),
    bio: z.string().optional(),
    image: z.string().optional(),
    socialLinks: z.object({
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      website: z.string().optional()
    }).optional()
  })).optional(),
  tags: z.array(z.string()).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  locationDetails: z.object({
    address: z.string().optional(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional(),
    parking: z.boolean().optional(),
    accessibility: z.boolean().optional(),
    directions: z.string().optional()
  }).optional(),
  onlineDetails: z.object({
    platform: z.string().optional(),
    meetingLink: z.string().optional(),
    meetingId: z.string().optional(),
    password: z.string().optional(),
    instructions: z.string().optional()
  }).optional(),
  materials: z.array(z.object({
    title: z.string(),
    type: z.enum(['document', 'video', 'link', 'other']),
    url: z.string(),
    description: z.string().optional()
  })).optional(),
  socialMedia: z.object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    instagram: z.string().optional()
  }).optional(),
});

function validateId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!validateId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const doc = await Event.findById(id).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ event: toObject(doc as { _id: unknown }) });
  } catch (err) {
    console.error("[GET /admin/events/:id]", err);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!validateId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const json = await req.json();
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    // If slug provided, ensure uniqueness
    if (parsed.data.slug) {
      const exists = await Event.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
      if (exists) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    const updated = await Event.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ event: toObject(updated as { _id: unknown }) });
  } catch (err) {
    console.error("[PATCH /admin/events/:id]", err);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!validateId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const deleted = await Event.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /admin/events/:id]", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
