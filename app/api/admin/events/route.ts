import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import Event from "@/lib/models/Event";

const eventSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/).transform((s)=>s.toLowerCase()).optional(),
  description: z.string().min(1),
  // Support both old and new date formats
  date: z.string().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  startAt: z.string().or(z.date()).optional().transform((v) => v ? new Date(v) : undefined),
  endAt: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
  venue: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
  image: z.string().optional(),
  registrationLink: z.string().optional(),
  status: z.enum(["draft", "published", "cancelled", "completed"]).default("published"),
  capacity: z.number().int().nonnegative().default(0),
  seatsRemaining: z.number().int().nonnegative().default(0),
  // Additional fields for compatibility
  type: z.string().optional(),
  attendees: z.string().optional(),
  featured: z.boolean().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
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

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const q: Record<string, unknown> = {};
    if (status && ["draft", "published", "cancelled", "completed"].includes(status)) {
      q.status = status;
    }
    const events = await Event.find(q).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ events: events.map((e) => ({ ...toObject(e as { _id: unknown }) })) });
  } catch (err: unknown) {
    console.error("[GET /admin/events]", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = eventSchema.safeParse(json);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error.flatten());
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;

    // Generate slug if not provided
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    // Check for existing slug
    if (data.slug) {
      const exists = await Event.findOne({ slug: data.slug });
      if (exists) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
      }
    }

    // Generate ID
    const lastEvent = await Event.findOne({}).sort({ id: -1 }).lean() as { id: number } | null;
    const nextId = lastEvent && lastEvent.id > 0 ? lastEvent.id + 1 : 1;

    const eventData = {
      ...data,
      id: nextId
    };

    const doc = await Event.create(eventData);
    return NextResponse.json({ event: toObject(doc.toObject()) }, { status: 201 });
  } catch (err: unknown) {
    console.error("[POST /admin/events]", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
