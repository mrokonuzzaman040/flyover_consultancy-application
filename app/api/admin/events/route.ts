import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Event } from "@/lib/models/Event";

const eventSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(1),
  startAt: z.string().or(z.date()).transform((v) => new Date(v)),
  endAt: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
  venue: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published", "cancelled", "completed"]).default("draft"),
  capacity: z.number().int().nonnegative().default(0),
  seatsRemaining: z.number().int().nonnegative().default(0),
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
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const exists = await Event.findOne({ slug: parsed.data.slug });
    if (exists) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const doc = await Event.create(parsed.data);
    return NextResponse.json({ event: toObject(doc.toObject()) }, { status: 201 });
  } catch (err: unknown) {
    console.error("[POST /admin/events]", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
