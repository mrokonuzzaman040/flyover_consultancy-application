import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import StudyAbroadStep from "@/lib/models/StudyAbroadStep";

const schema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check if we're in build mode or if MongoDB is not available
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { studyAbroadStep: null, error: 'Database not available during build' },
        { status: 503 }
      );
    }

    await dbConnect();
    const { id } = await params;
    const studyAbroadStep = await StudyAbroadStep.findOne({ stepId: parseInt(id) }).lean();
    
    if (!studyAbroadStep) {
      return NextResponse.json({ error: "Study abroad step not found" }, { status: 404 });
    }
    
    return NextResponse.json({ studyAbroadStep: toObject(studyAbroadStep as { _id: unknown }) });
  } catch (e: unknown) {
    // Handle MongoDB connection errors gracefully during build
    if (e instanceof Error && e.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { studyAbroadStep: null, error: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch study abroad step" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = await params;
    
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    
    const studyAbroadStep = await StudyAbroadStep.findOneAndUpdate(
      { stepId: parseInt(id) },
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).lean();
    
    if (!studyAbroadStep) {
      return NextResponse.json({ error: "Study abroad step not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Study abroad step updated successfully", 
      studyAbroadStep: toObject(studyAbroadStep as { _id: unknown }) 
    });
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update study abroad step" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const studyAbroadStep = await StudyAbroadStep.findOneAndDelete({ stepId: parseInt(id) }).lean();
    
    if (!studyAbroadStep) {
      return NextResponse.json({ error: "Study abroad step not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Study abroad step deleted successfully", 
      studyAbroadStep: toObject(studyAbroadStep as { _id: unknown }) 
    });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete study abroad step" }, { status: 500 });
  }
}
