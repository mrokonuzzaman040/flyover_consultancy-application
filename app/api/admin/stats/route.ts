import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import Stat from "@/lib/models/Stat";

const schema = z.object({
  label: z.string().min(1),
  number: z.string().min(1),
  description: z.string().min(1),
});

export async function GET() {
  try {
    // Check if we're in build mode or if MongoDB is not available
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { stats: [], error: 'Database not available during build' },
        { status: 503 }
      );
    }

    await dbConnect();
    const docs = await Stat.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ stats: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    // Handle MongoDB connection errors gracefully during build
    if (e instanceof Error && e.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { stats: [], error: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    
    // Generate next ID
    const lastStat = await Stat.findOne({}).sort({ id: -1 }).lean() as { id: number } | null;
    const nextId = lastStat ? lastStat.id + 1 : 1;
    
    const statData = {
      ...parsed.data,
      id: nextId
    };
    
    const doc = await Stat.create(statData);
    return NextResponse.json({ stat: toObject(doc.toObject()) }, { status: 201 });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create stat" }, { status: 500 });
  }
}
