import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import Award from "@/lib/models/Award";

const schema = z.object({
  title: z.string().min(1),
  image: z.string().min(1),
  year: z.number().min(1900).max(new Date().getFullYear() + 10),
});

export async function GET() {
  try {
    // Check if we're in build mode or if MongoDB is not available
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { awards: [], error: 'Database not available during build' },
        { status: 503 }
      );
    }

    await dbConnect();
    const docs = await Award.find({}).sort({ year: -1, createdAt: -1 }).lean();
    return NextResponse.json({ awards: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    // Handle MongoDB connection errors gracefully during build
    if (e instanceof Error && e.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { awards: [], error: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch awards" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    
    // Generate next ID
    const lastAward = await Award.findOne({}).sort({ id: -1 }).lean() as { id: number } | null;
    const nextId = lastAward ? lastAward.id + 1 : 1;
    
    const awardData = {
      ...parsed.data,
      id: nextId
    };
    
    const doc = await Award.create(awardData);
    return NextResponse.json({ award: toObject(doc.toObject()) }, { status: 201 });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create award" }, { status: 500 });
  }
}
