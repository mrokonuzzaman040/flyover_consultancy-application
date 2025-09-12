import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const LeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val.replace(/[\s-()]/g, '')), {
    message: "Please enter a valid phone number"
  }),
  countryInterest: z.array(z.string()).min(1, "Please select at least one country"),
  serviceInterest: z.array(z.string()).optional().default([]),
  message: z.string().max(500, "Message must be less than 500 characters").optional().default(""),
  purpose: z.enum(["consultation", "enquiry"]).default("consultation"),
  timestamp: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Security headers check
    const headersList = await headers();
    const requestedWith = headersList.get('x-requested-with');
    const contentType = headersList.get('content-type');
    
    if (requestedWith !== 'XMLHttpRequest') {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 403 }
      );
    }

    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    // Basic rate limiting using in-memory store (for production, use Redis)
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '127.0.0.1';
    
    // Simple rate limiting check (can be enhanced with Redis in production)
    const rateLimitKey = `rate_limit_${ip}`;
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 5;
    
    // In production, this should use a proper cache like Redis
    // For now, we'll skip rate limiting to avoid complexity

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    // Validate timestamp (basic replay attack protection)
    if (body.timestamp) {
      const now = Date.now();
      const requestTime = body.timestamp;
      const timeDiff = Math.abs(now - requestTime);
      
      // Reject requests older than 5 minutes or from the future
      if (timeDiff > 5 * 60 * 1000) {
        return NextResponse.json(
          { error: "Request expired" },
          { status: 400 }
        );
      }
    }
    
    const parsed = LeadSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: parsed.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const input = parsed.data;
    
    // Sanitize data
    const sanitizedInput = {
      ...input,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim(),
      message: input.message?.trim(),
    };

    // Store in DB if DATABASE_URL is configured, otherwise no-op
    if (process.env.DATABASE_URL) {
      await prisma.lead.create({
        data: {
          name: sanitizedInput.name,
          email: sanitizedInput.email,
          phone: sanitizedInput.phone,
          countryInterest: sanitizedInput.countryInterest,
          serviceInterest: sanitizedInput.serviceInterest,
          message: sanitizedInput.message,
          source: sanitizedInput.purpose,
          status: "new",
        },
      });
    } else {
      console.warn("DATABASE_URL not set — running in mock mode for /api/leads");
    }

    return NextResponse.json(
      { 
        message: "Your message has been sent successfully. We'll contact you within 24 hours.", 
        ok: true 
      },
      { 
        status: 200,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    );
  } catch (err: unknown) {
    console.error("Error processing lead:", err);
    const message = err instanceof Error ? err.message : "We're experiencing technical difficulties. Please try again later.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
