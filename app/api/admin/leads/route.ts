import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Lead } from "@/lib/models/Lead";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  countryInterest: z.array(z.string()).default([]),
  serviceInterest: z.array(z.string()).default([]),
  message: z.string().optional().nullable(),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED"]).default("NEW"),
});

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const q: Record<string, unknown> = {};
    if (status && ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED"].includes(status)) q.status = status;
    const docs = await Lead.find(q).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ leads: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ message: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
    const doc = await Lead.create(parsed.data);
    return NextResponse.json({ lead: toObject(doc.toObject()) }, { status: 201 });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ message: "Failed to create lead" }, { status: 500 });
  }
}
