import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { MeetingSchedule } from "@/lib/models/MeetingSchedule";

const createSchema = z.object({
  fullName: z.string().min(1),
  phoneNumber: z.string().min(1),
  email: z.string().email().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  scheduledDateTime: z.string().or(z.date()).transform((v) => new Date(v)),
  message: z.string().optional(),
  preferredService: z.string().optional(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]).default("LOW"),
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).default("PENDING"),
});

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "10", 10), 1), 100);
    const status = searchParams.get("status");
    const urgency = searchParams.get("urgency");
    const search = searchParams.get("search");

    const q: Record<string, unknown> = {};
    if (status && ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(status)) q.status = status;
    if (urgency && ["LOW", "MEDIUM", "HIGH"].includes(urgency)) q.urgency = urgency;
    if (search) {
      q.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      MeetingSchedule.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      MeetingSchedule.countDocuments(q),
    ]);

    return NextResponse.json({
      meetings: items.map((m) => ({ ...toObject(m as { _id: unknown }) })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch meetings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = createSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const doc = await MeetingSchedule.create(parsed.data);
    return NextResponse.json({ meeting: toObject(doc.toObject()) }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create meeting" }, { status: 500 });
  }
}

