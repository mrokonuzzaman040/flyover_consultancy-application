import { NextResponse } from "next/server";
import { dbConnect, toObject } from "@/lib/mongoose";
import Team from "@/lib/models/Team";

export async function GET() {
  try {
    await dbConnect();
    const docs = await Team.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ team: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}
