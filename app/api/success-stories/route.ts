import { NextResponse } from "next/server";
import { dbConnect, toObject } from "@/lib/mongoose";
import SuccessStory from "@/lib/models/SuccessStory";

export async function GET() {
  try {
    await dbConnect();
    const docs = await SuccessStory.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ successStories: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch success stories" }, { status: 500 });
  }
}
