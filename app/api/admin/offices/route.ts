import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Office } from "@/lib/models/Office";

const schema = z.object({
  city: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().nullable(),
  mapEmbedUrl: z.string().optional().nullable(),
});

export async function GET() {
  try {
    await dbConnect();
    const docs = await Office.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ offices: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch offices" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const doc = await Office.create(parsed.data);
    return NextResponse.json({ office: toObject(doc.toObject()) }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create office" }, { status: 500 });
  }
}

