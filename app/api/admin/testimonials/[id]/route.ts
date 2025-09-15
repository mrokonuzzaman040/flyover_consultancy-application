import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Testimonial } from "@/lib/models/Testimonial";

const patchSchema = z.object({
  author: z.string().min(1).optional(),
  quote: z.string().min(1).optional(),
  source: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  publishedAt: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
});

function isValid(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const json = await req.json();
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const updated = await Testimonial.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ testimonial: toObject(updated as { _id: unknown }) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const deleted = await Testimonial.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const doc = await Testimonial.findById(id).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ testimonial: toObject(doc as { _id: unknown }) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch testimonial" }, { status: 500 });
  }
}
