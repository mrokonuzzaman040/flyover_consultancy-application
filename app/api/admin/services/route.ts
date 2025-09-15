import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Service } from "@/lib/models/Service";

const feature = z.object({ icon: z.string().optional(), title: z.string(), description: z.string() });
const processStep = z.object({ step: z.string(), title: z.string(), description: z.string() });

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaText: z.string().optional().nullable(),
  sectionsMD: z.array(z.string()).default([]),
  features: z.array(feature).default([]),
  benefits: z.array(z.string()).default([]),
  process: z.array(processStep).default([]),
});

export async function GET() {
  try {
    await dbConnect();
    const docs = await Service.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ services: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const exists = await Service.findOne({ slug: parsed.data.slug });
    if (exists) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    const doc = await Service.create(parsed.data);
    return NextResponse.json({ service: toObject(doc.toObject()) }, { status: 201 });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
