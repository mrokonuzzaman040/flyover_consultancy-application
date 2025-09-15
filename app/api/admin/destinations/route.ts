import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Destination } from "@/lib/models/Destination";

const schema = z.object({
  country: z.string().min(1),
  slug: z.string().min(1).transform((s)=>s.toLowerCase()).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  hero: z.string().optional().nullable(),
  overviewMD: z.string().optional().nullable(),
  costsMD: z.string().optional().nullable(),
  intakesMD: z.string().optional().nullable(),
  visaMD: z.string().optional().nullable(),
  scholarshipsMD: z.string().optional().nullable(),
  popularCourses: z.array(z.string()).default([]),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
});

export async function GET() {
  try {
    await dbConnect();
    const docs = await Destination.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ destinations: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const exists = await Destination.findOne({ slug: parsed.data.slug });
    if (exists) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    const doc = await Destination.create(parsed.data);
    return NextResponse.json({ destination: toObject(doc.toObject()) }, { status: 201 });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create destination" }, { status: 500 });
  }
}
