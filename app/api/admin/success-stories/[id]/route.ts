import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import SuccessStory from "@/lib/models/SuccessStory";

const schema = z.object({
  name: z.string().min(1).optional(),
  university: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  course: z.string().min(1).optional(),
  testimonial: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check if we're in build mode or if MongoDB is not available
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { successStory: null, error: 'Database not available during build' },
        { status: 503 }
      );
    }

    await dbConnect();
    const { id } = await params;
    const successStory = await SuccessStory.findOne({ id: parseInt(id) }).lean();
    
    if (!successStory) {
      return NextResponse.json({ error: "Success story not found" }, { status: 404 });
    }
    
    return NextResponse.json({ successStory: toObject(successStory as { _id: unknown }) });
  } catch (e: unknown) {
    // Handle MongoDB connection errors gracefully during build
    if (e instanceof Error && e.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { successStory: null, error: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch success story" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = await params;
    
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    
    const successStory = await SuccessStory.findOneAndUpdate(
      { id: parseInt(id) },
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).lean();
    
    if (!successStory) {
      return NextResponse.json({ error: "Success story not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Success story updated successfully", 
      successStory: toObject(successStory as { _id: unknown }) 
    });
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update success story" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const successStory = await SuccessStory.findOneAndDelete({ id: parseInt(id) }).lean();
    
    if (!successStory) {
      return NextResponse.json({ error: "Success story not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Success story deleted successfully", 
      successStory: toObject(successStory as { _id: unknown }) 
    });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete success story" }, { status: 500 });
  }
}
