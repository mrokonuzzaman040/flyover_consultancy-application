import { NextRequest, NextResponse } from "next/server";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Service } from "@/lib/models/Service";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect();
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }
    
    const doc = await Service.findOne({ slug }).lean();
    
    if (!doc) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      service: toObject(doc as { _id: unknown })
    });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}