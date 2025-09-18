import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Lead } from "@/lib/models/Lead";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  countryInterest: z.array(z.string()).optional(),
  serviceInterest: z.array(z.string()).optional(),
  message: z.string().optional().nullable(),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED"]).optional(),
});

function isValid(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!isValid(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    const doc = await Lead.findById(id).lean();
    if (!doc) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ lead: toObject(doc as { _id: unknown }) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Failed to fetch lead" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // allow full or partial updates via PUT
  try {
    await dbConnect();
    const { id } = await params;
    if (!isValid(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    const json = await req.json();
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
    const updated = await Lead.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ lead: toObject(updated as { _id: unknown }) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!isValid(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    const deleted = await Lead.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Failed to delete lead" }, { status: 500 });
  }
}
