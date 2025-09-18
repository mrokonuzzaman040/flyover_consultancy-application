import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import Team from "@/lib/models/Team";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  image: z.string().min(1, "Image is required"),
  bio: z.string().min(1, "Bio is required"),
  expertise: z.array(z.string().min(1)).min(1, "At least one expertise is required"),
  email: z.string().email("Valid email is required"),
  linkedin: z.string().optional().default(''),
  phone: z.string().min(1, "Phone is required"),
  isActive: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
});

export async function GET() {
  try {
    await dbConnect();
    const docs = await Team.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ team: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    
    const doc = await Team.create(parsed.data);
    return NextResponse.json({ team: toObject(doc.toObject()) }, { status: 201 });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}
