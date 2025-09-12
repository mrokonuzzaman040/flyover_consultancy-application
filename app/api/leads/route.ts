import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  countryInterest: z.array(z.string()).min(1),
  serviceInterest: z.array(z.string()).optional().default([]),
  message: z.string().optional().default(""),
  purpose: z.enum(["consultation", "enquiry"]).default("consultation"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = LeadSchema.parse(body);

    // Store in DB if DATABASE_URL is configured, otherwise no-op
    if (process.env.DATABASE_URL) {
      await prisma.lead.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          countryInterest: input.countryInterest,
          serviceInterest: input.serviceInterest,
          message: input.message,
          source: input.purpose,
          status: "new",
        },
      });
    } else {
      console.warn("DATABASE_URL not set — running in mock mode for /api/leads");
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
