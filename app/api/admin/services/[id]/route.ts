import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Service } from "@/lib/models/Service";

const feature = z.object({ icon: z.string().optional(), title: z.string(), description: z.string() });
const processStep = z.object({ step: z.string(), title: z.string(), description: z.string() });

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  title: z.string().min(1).optional(),
  subtitle: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
  ctaLabel: z.string().min(1).optional(),
  ctaText: z.string().min(1).optional(),
  sectionsMD: z.array(z.string()).min(1).optional(),
  features: z.array(feature).min(1).optional(),
  benefits: z.array(z.string()).min(1).optional(),
  process: z.array(processStep).min(1).optional(),
  popular: z.boolean().optional(),
});

function isValid(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const doc = await Service.findById(id).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ service: toObject(doc as { _id: unknown }) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const json = await req.json();
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    if (parsed.data.slug) {
      const exists = await Service.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
      if (exists) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    const updated = await Service.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ service: toObject(updated as { _id: unknown }) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const deleted = await Service.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
