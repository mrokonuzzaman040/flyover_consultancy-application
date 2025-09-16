import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import Stat from "@/lib/models/Stat";

const schema = z.object({
  label: z.string().min(1).optional(),
  number: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check if we're in build mode or if MongoDB is not available
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { stat: null, error: 'Database not available during build' },
        { status: 503 }
      );
    }

    await dbConnect();
    const { id } = await params;
    
    // Try to find by numeric id first, then by _id if not found
    let stat = await Stat.findOne({ id: parseInt(id) }).lean();
    if (!stat) {
      stat = await Stat.findById(id).lean();
    }
    
    if (!stat) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 });
    }
    
    const transformed = toObject(stat as { _id: unknown });
    // Apply same transformation as in the main route
    if (transformed.value && !transformed.number) {
      transformed.number = transformed.value;
      delete transformed.value;
    }
    if (transformed.icon) {
      delete transformed.icon;
    }
    if (!transformed.description) {
      transformed.description = `Description for ${transformed.label}`;
    }
    
    return NextResponse.json({ stat: transformed });
  } catch (e: unknown) {
    // Handle MongoDB connection errors gracefully during build
    if (e instanceof Error && e.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { stat: null, error: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch stat" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = await params;
    
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    
    // Try to find by numeric id first, then by _id if not found
    let stat = await Stat.findOneAndUpdate(
      { id: parseInt(id) },
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).lean();
    
    if (!stat) {
      stat = await Stat.findByIdAndUpdate(
        id,
        { $set: parsed.data },
        { new: true, runValidators: true }
      ).lean();
    }
    
    if (!stat) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 });
    }
    
    const transformed = toObject(stat as { _id: unknown });
    // Apply same transformation as in the main route
    if (transformed.value && !transformed.number) {
      transformed.number = transformed.value;
      delete transformed.value;
    }
    if (transformed.icon) {
      delete transformed.icon;
    }
    if (!transformed.description) {
      transformed.description = `Description for ${transformed.label}`;
    }
    
    return NextResponse.json({ 
      message: "Stat updated successfully", 
      stat: transformed 
    });
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update stat" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // Try to find by numeric id first, then by _id if not found
    let stat = await Stat.findOneAndDelete({ id: parseInt(id) }).lean();
    if (!stat) {
      stat = await Stat.findByIdAndDelete(id).lean();
    }
    
    if (!stat) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Stat deleted successfully", 
      stat: toObject(stat as { _id: unknown }) 
    });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete stat" }, { status: 500 });
  }
}
