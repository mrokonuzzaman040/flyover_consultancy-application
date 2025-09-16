import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import Service from "@/lib/models/Service";

const feature = z.object({ icon: z.string().optional(), title: z.string(), description: z.string() });
const processStep = z.object({ step: z.string(), title: z.string(), description: z.string() });

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).transform((s)=>s.toLowerCase()),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  ctaLabel: z.string().min(1),
  ctaText: z.string().min(1),
  sectionsMD: z.array(z.string()).min(1),
  features: z.array(feature).min(1),
  benefits: z.array(z.string()).min(1),
  process: z.array(processStep).min(1),
  popular: z.boolean().optional().default(false),
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
