import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { Scholarship } from "@/lib/models/Scholarship";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    
    const resolvedParams = await params;
    const scholarship = await Scholarship.findOne({ slug: resolvedParams.slug });

    if (!scholarship) {
      return NextResponse.json(
        { error: "Scholarship not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      scholarship,
    });
  } catch (error) {
    console.error("Error fetching scholarship:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}