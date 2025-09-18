import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import StudyAbroadStep from "@/lib/models/StudyAbroadStep";

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
        { studyAbroadSteps: [], error: 'Database not available during build' },
        { status: 503 }
      );
    }

    await dbConnect();
    const docs = await StudyAbroadStep.find({}).sort({ stepId: 1, createdAt: -1 }).lean();
    return NextResponse.json({ studyAbroadSteps: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    // Handle MongoDB connection errors gracefully during build
    if (e instanceof Error && e.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { studyAbroadSteps: [], error: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch study abroad steps" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    
    // Generate next stepId
    const lastStep = await StudyAbroadStep.findOne({}).sort({ stepId: -1 }).lean() as { stepId: number } | null;
    const nextStepId = lastStep ? lastStep.stepId + 1 : 1;
    
    const stepData = {
      ...parsed.data,
      stepId: nextStepId
    };
    
    const doc = await StudyAbroadStep.create(stepData);
    return NextResponse.json({ studyAbroadStep: toObject(doc.toObject()) }, { status: 201 });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create study abroad step" }, { status: 500 });
  }
}
