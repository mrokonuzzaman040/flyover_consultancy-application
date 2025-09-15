import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Resource } from "@/lib/models/Resource";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/).transform((s)=>s.toLowerCase()),
  contentMD: z.string().min(1),
  tags: z.array(z.string()).default([]),
  category: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  coverUrl: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  publishedAt: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
});

export async function GET() {
  try { await dbConnect();
    const docs = await Resource.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ resources: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    console.error(e); return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect(); const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const exists = await Resource.findOne({ slug: parsed.data.slug });
    if (exists) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    const doc = await Resource.create(parsed.data);
    return NextResponse.json({ resource: toObject(doc.toObject()) }, { status: 201 });
  } catch (e: unknown) {
    console.error(e); return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
