import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import WhyChooseUsFeature from "@/lib/models/WhyChooseUsFeature";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
});

export async function GET() {
  try {
    // Check if we're in build mode or if MongoDB is not available
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { whyChooseUsFeatures: [], error: 'Database not available during build' },
        { status: 503 }
      );
    }

    await dbConnect();
    const docs = await WhyChooseUsFeature.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ whyChooseUsFeatures: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    // Handle MongoDB connection errors gracefully during build
    if (e instanceof Error && e.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { whyChooseUsFeatures: [], error: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch why choose us features" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    
    // Generate next ID
    const lastFeature = await WhyChooseUsFeature.findOne({}).sort({ id: -1 }).lean() as { id: number } | null;
    const nextId = lastFeature ? lastFeature.id + 1 : 1;
    
    const featureData = {
      ...parsed.data,
      id: nextId
    };
    
    const doc = await WhyChooseUsFeature.create(featureData);
    return NextResponse.json({ whyChooseUsFeature: toObject(doc.toObject()) }, { status: 201 });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create why choose us feature" }, { status: 500 });
  }
}
