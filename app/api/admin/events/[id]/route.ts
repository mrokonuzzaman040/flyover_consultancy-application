import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Event } from "@/lib/models/Event";

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().min(1).optional(),
  startAt: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
  endAt: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
  venue: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published", "cancelled", "completed"]).optional(),
  capacity: z.number().int().nonnegative().optional(),
  seatsRemaining: z.number().int().nonnegative().optional(),
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
