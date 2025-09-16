import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/mongoose";
import { Lead } from "@/lib/models/Lead";

// Validation schema matching the form
const LeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required").refine((val) => /^\+[1-9]\d{1,14}$/.test(val.replace(/[\s-()]/g, '')), {
    message: "Please enter a valid phone number with country code (e.g., +1234567890)"
  }),
  countryInterest: z.array(z.string()).min(1, "Please select at least one country"),
  serviceInterest: z.array(z.string()).optional(),
  message: z.string().max(500, "Message must be less than 500 characters").optional(),
  purpose: z.enum(["consultation", "enquiry"]).optional(),
  timestamp: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate the data
    const validatedData = LeadSchema.parse(body);
    
    // Connect to database
    await dbConnect();
    
    // Prepare lead data for database
    const leadData = {
      name: validatedData.name,
      email: validatedData.email || undefined,
      phone: validatedData.phone,
      countryInterest: validatedData.countryInterest,
      serviceInterest: validatedData.serviceInterest || [],
      message: validatedData.message || "",
      purpose: validatedData.purpose || "consultation",
      source: "website_form",
      status: "NEW",
    };
    
    // Create the lead
    const lead = new Lead(leadData);
    await lead.save();
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Lead created successfully",
        id: lead._id 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error creating lead:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: error.flatten() 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}