import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ratelimit } from "@/lib/ratelimit";



export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const urgency = searchParams.get("urgency");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      OR?: Array<{
        fullName?: { contains: string; mode: 'insensitive' }
        email?: { contains: string; mode: 'insensitive' }
        phoneNumber?: { contains: string; mode: 'insensitive' }
      }>
      status?: string
      urgency?: string
    } = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phoneNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (urgency && urgency !== "all") {
      where.urgency = urgency;
    }

    // Fetch meetings and total count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [meetings, total] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma as any).meetingSchedule.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
          email: true,
          preferredDate: true,
          preferredTime: true,
          message: true,
          preferredService: true,
          urgency: true,
          status: true,
          createdAt: true,
        },
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma as any).meetingSchedule.count({ where }),
    ]);

    return NextResponse.json({
      meetings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching meeting schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch meeting schedules" },
      { status: 500 }
    );
  }
}