import { NextResponse } from "next/server";
import { dbConnect, toObject } from "@/lib/mongoose";
import Award from "@/lib/models/Award";

export async function GET() {
  try {
    await dbConnect();
    const docs = await Award.find({}).sort({ year: -1, createdAt: -1 }).lean();
    return NextResponse.json({ awards: docs.map((d) => ({ ...toObject(d as { _id: unknown }) })) });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch awards" }, { status: 500 });
  }
}
