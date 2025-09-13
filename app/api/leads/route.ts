import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Enhanced phone number validation with country code verification
const validatePhoneNumber = (phone: string): boolean => {
  // Remove all non-digit characters except +
  const cleanPhone = phone.replace(/[^+\d]/g, '');
  
  // Must start with + (country code required)
  if (!cleanPhone.startsWith('+')) {
    return false;
  }
  
  // Remove the + for further validation
  const phoneDigits = cleanPhone.substring(1);
  
  // Must be between 7-15 digits (ITU-T E.164 standard)
  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    return false;
  }
  
  // Must contain only digits after country code
  if (!/^\d+$/.test(phoneDigits)) {
    return false;
  }
  
  // Country code validation (1-4 digits)
  const countryCodeMatch = phoneDigits.match(/^(\d{1,4})/);
  if (!countryCodeMatch) {
    return false;
  }
  
  const countryCode = countryCodeMatch[1];
  
  // Validate against common country codes
  const validCountryCodes = [
    '1', '7', '20', '27', '30', '31', '32', '33', '34', '36', '39', '40', '41', '43', '44', '45', '46', '47', '48', '49',
    '51', '52', '53', '54', '55', '56', '57', '58', '60', '61', '62', '63', '64', '65', '66', '81', '82', '84', '86',
    '90', '91', '92', '93', '94', '95', '98', '212', '213', '216', '218', '220', '221', '222', '223', '224', '225',
    '226', '227', '228', '229', '230', '231', '232', '233', '234', '235', '236', '237', '238', '239', '240', '241',
    '242', '243', '244', '245', '246', '248', '249', '250', '251', '252', '253', '254', '255', '256', '257', '258',
    '260', '261', '262', '263', '264', '265', '266', '267', '268', '269', '290', '291', '297', '298', '299', '350',
    '351', '352', '353', '354', '355', '356', '357', '358', '359', '370', '371', '372', '373', '374', '375', '376',
    '377', '378', '380', '381', '382', '383', '385', '386', '387', '389', '420', '421', '423', '500', '501', '502',
    '503', '504', '505', '506', '507', '508', '509', '590', '591', '592', '593', '594', '595', '596', '597', '598',
    '599', '670', '672', '673', '674', '675', '676', '677', '678', '679', '680', '681', '682', '683', '684', '685',
    '686', '687', '688', '689', '690', '691', '692', '850', '852', '853', '855', '856', '880', '886', '960', '961',
    '962', '963', '964', '965', '966', '967', '968', '970', '971', '972', '973', '974', '975', '976', '977', '992',
    '993', '994', '995', '996', '998'
  ];
  
  // Check if country code is valid
  const isValidCountryCode = validCountryCodes.some(code => countryCode.startsWith(code));
  if (!isValidCountryCode) {
    return false;
  }
  
  return true;
};

const LeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string().min(1, "Phone number is required").refine((val) => {
    if (!val || val.trim() === '') {
      return false;
    }
    return validatePhoneNumber(val.trim());
  }, {
    message: "Please enter a valid phone number with country code (e.g., +1234567890). Phone number must start with + followed by country code and 7-15 digits total."
  }),
  countryInterest: z.array(z.string()).min(1, "Please select at least one country"),
  serviceInterest: z.array(z.string()).optional().default([]),
  message: z.string().max(500, "Message must be less than 500 characters").optional().default(""),
  purpose: z.enum(["consultation", "enquiry"]).default("consultation"),
  timestamp: z.number().optional(),
});

export async function GET(req: NextRequest) {
  try {
    // Check authentication for admin access
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: {
      status?: string;
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        email?: { contains: string; mode: 'insensitive' };
        phone?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};
    if (status && status !== 'ALL') {
      where.status = status.toLowerCase();
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch leads with pagination
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.lead.count({ where })
    ]);

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

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

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch {
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
      email: input.email?.trim().toLowerCase(),
      phone: input.phone.trim(),
      message: input.message?.trim(),
    };

    // Store in DB if DATABASE_URL is configured, otherwise no-op
    if (process.env.DATABASE_URL) {
      await prisma.lead.create({
        data: {
          name: sanitizedInput.name,
          email: sanitizedInput.email || "",
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
