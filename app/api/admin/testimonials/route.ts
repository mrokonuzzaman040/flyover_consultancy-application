import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Testimonial } from "@/lib/models/Testimonial";

const schema = z.object({
  author: z.string().min(1),
  quote: z.string().min(1),
  source: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  publishedAt: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
});

export async function GET() {
  try {
    await dbConnect();
    const docs = await Testimonial.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ testimonials: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const doc = await Testimonial.create(parsed.data);
    return NextResponse.json({ testimonial: toObject(doc.toObject()) }, { status: 201 });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
