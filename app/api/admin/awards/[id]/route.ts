import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import Award from "@/lib/models/Award";

const schema = z.object({
  title: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
  year: z.number().min(1900).max(new Date().getFullYear() + 10).optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check if we're in build mode or if MongoDB is not available
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { award: null, error: 'Database not available during build' },
        { status: 503 }
      );
    }

    await dbConnect();
    const { id } = await params;
    const award = await Award.findOne({ id: parseInt(id) }).lean();
    
    if (!award) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }
    
    return NextResponse.json({ award: toObject(award as { _id: unknown }) });
  } catch (e: unknown) {
    // Handle MongoDB connection errors gracefully during build
    if (e instanceof Error && e.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { award: null, error: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch award" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = await params;
    
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    
    const award = await Award.findOneAndUpdate(
      { id: parseInt(id) },
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).lean();
    
    if (!award) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Award updated successfully", 
      award: toObject(award as { _id: unknown }) 
    });
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update award" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const award = await Award.findOneAndDelete({ id: parseInt(id) }).lean();
    
    if (!award) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Award deleted successfully", 
      award: toObject(award as { _id: unknown }) 
    });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete award" }, { status: 500 });
  }
}
