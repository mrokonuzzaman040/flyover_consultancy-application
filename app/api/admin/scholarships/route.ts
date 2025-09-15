import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Scholarship } from "@/lib/models/Scholarship";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().optional().nullable(),
  eligibilityMD: z.string().optional().nullable(),
  benefitsMD: z.string().optional().nullable(),
  deadline: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
  country: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export async function GET() {
  try { await dbConnect();
    const docs = await Scholarship.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ scholarships: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) { console.error(e); return NextResponse.json({ error: "Failed to fetch scholarships" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try { await dbConnect(); const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const exists = await Scholarship.findOne({ slug: parsed.data.slug });
    if (exists) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    const doc = await Scholarship.create(parsed.data);
    return NextResponse.json({ scholarship: toObject(doc.toObject()) }, { status: 201 });
  } catch (e: unknown) { console.error(e); return NextResponse.json({ error: "Failed to create scholarship" }, { status: 500 }); }
}
