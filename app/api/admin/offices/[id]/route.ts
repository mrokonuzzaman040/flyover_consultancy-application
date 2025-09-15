import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Office } from "@/lib/models/Office";

const patchSchema = z.object({
  city: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional().nullable(),
  mapEmbedUrl: z.string().optional().nullable(),
});

function isValid(id: string) { return mongoose.Types.ObjectId.isValid(id); }

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await dbConnect(); const { id } = await params; if (!isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const doc = await Office.findById(id).lean(); if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ office: toObject(doc as { _id: unknown }) });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed to fetch office" }, { status: 500 }); }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await dbConnect(); const { id } = await params; if (!isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const json = await req.json(); const parsed = patchSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const updated = await Office.findByIdAndUpdate(id, parsed.data, { new: true }).lean(); if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ office: toObject(updated as { _id: unknown }) });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed to update office" }, { status: 500 }); }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await dbConnect(); const { id } = await params; if (!isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const deleted = await Office.findByIdAndDelete(id).lean(); if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed to delete office" }, { status: 500 }); }
}

