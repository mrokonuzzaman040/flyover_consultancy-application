import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import SuccessStory from "@/lib/models/SuccessStory";

const schema = z.object({
  name: z.string().min(1),
  university: z.string().min(1),
  country: z.string().min(1),
  course: z.string().min(1),
  testimonial: z.string().min(1),
  image: z.string().min(1),
});

export async function GET() {
  try {
    // Check if we're in build mode or if MongoDB is not available
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { successStories: [], error: 'Database not available during build' },
        { status: 503 }
      );
    }

    await dbConnect();
    const docs = await SuccessStory.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ successStories: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    // Handle MongoDB connection errors gracefully during build
    if (e instanceof Error && e.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { successStories: [], error: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch success stories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    
    // Generate next ID
    const lastSuccessStory = await SuccessStory.findOne({}).sort({ id: -1 }).lean() as { id: number } | null;
    const nextId = lastSuccessStory ? lastSuccessStory.id + 1 : 1;
    
    const successStoryData = {
      ...parsed.data,
      id: nextId
    };
    
    const doc = await SuccessStory.create(successStoryData);
    return NextResponse.json({ successStory: toObject(doc.toObject()) }, { status: 201 });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create success story" }, { status: 500 });
  }
}
