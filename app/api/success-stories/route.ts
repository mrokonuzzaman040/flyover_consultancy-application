import { NextResponse } from "next/server";
import { dbConnect, toObject } from "@/lib/mongoose";
import SuccessStory from "@/lib/models/SuccessStory";

export async function GET() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected, fetching success stories...');
    const docs = await SuccessStory.find({}).sort({ createdAt: -1 }).lean();
    console.log(`Found ${docs.length} success stories`);
    return NextResponse.json({ successStories: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    console.error('Error in success stories API:', e);
    return NextResponse.json({ error: "Failed to fetch success stories", details: String(e) }, { status: 500 });
  }
}
