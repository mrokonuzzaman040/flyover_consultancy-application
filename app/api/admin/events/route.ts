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
