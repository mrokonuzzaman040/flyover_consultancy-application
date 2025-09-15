import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { MeetingSchedule } from "@/lib/models/MeetingSchedule";

const patchSchema = z.object({
  fullName: z.string().min(1).optional(),
  phoneNumber: z.string().min(1).optional(),
  email: z.string().email().optional().nullable(),
  preferredDate: z.string().optional().nullable(),
  preferredTime: z.string().optional().nullable(),
  scheduledDateTime: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
  message: z.string().optional().nullable(),
  preferredService: z.string().optional().nullable(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
});

function isValid(id: string) { return mongoose.Types.ObjectId.isValid(id); }

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await dbConnect(); const { id } = await params; if (!isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const json = await req.json(); const parsed = patchSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const updated = await MeetingSchedule.findByIdAndUpdate(id, parsed.data, { new: true }).lean(); if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ meeting: toObject(updated as { _id: unknown }) });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed to update meeting" }, { status: 500 }); }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await dbConnect(); const { id } = await params; if (!isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const deleted = await MeetingSchedule.findByIdAndDelete(id).lean(); if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed to delete meeting" }, { status: 500 }); }
}

