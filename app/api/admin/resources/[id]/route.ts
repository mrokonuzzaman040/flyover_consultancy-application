import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Resource } from "@/lib/models/Resource";

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  contentMD: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  coverUrl: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  publishedAt: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
});

function isValid(id: string) { return mongoose.Types.ObjectId.isValid(id); }

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await dbConnect(); const { id } = await params; if (!isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const doc = await Resource.findById(id).lean(); if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ resource: toObject(doc as { _id: unknown }) });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed to fetch resource" }, { status: 500 }); }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await dbConnect(); const { id } = await params; if (!isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const json = await req.json(); const parsed = patchSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    if (parsed.data.slug) { const exists = await Resource.findOne({ slug: parsed.data.slug, _id: { $ne: id } }); if (exists) return NextResponse.json({ error: "Slug already exists" }, { status: 409 }); }
    const updated = await Resource.findByIdAndUpdate(id, parsed.data, { new: true }).lean(); if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ resource: toObject(updated as { _id: unknown }) });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed to update resource" }, { status: 500 }); }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await dbConnect(); const { id } = await params; if (!isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const deleted = await Resource.findByIdAndDelete(id).lean(); if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 }); }
}
