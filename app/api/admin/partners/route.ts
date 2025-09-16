import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Partner from "@/lib/models/Partner";

// GET - Fetch all partners
export async function GET() {
  try {
    await dbConnect();
    const partners = await Partner.find().sort({ id: 1 });
    
    // Transform the data to match the expected interface
    const transformedPartners = partners.map(partner => ({
      _id: partner._id,
      id: partner.id || 0,
      name: partner.name,
      logo: partner.logo,
      createdAt: partner.createdAt,
      updatedAt: partner.updatedAt
    }));
    
    return NextResponse.json({ partners: transformedPartners });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}

// POST - Create a new partner
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const {
      name,
      logo
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Get the next ID
    const lastPartner = await Partner.findOne().sort({ id: -1 });
    const nextId = lastPartner && lastPartner.id > 0 ? lastPartner.id + 1 : 1;

    const newPartner = new Partner({
      id: nextId,
      name,
      logo: logo || "https://via.placeholder.com/100x100?text=Logo" // Default placeholder if no logo provided
    });

    await newPartner.save();
    return NextResponse.json(newPartner, { status: 201 });
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: "Failed to create partner" },
      { status: 500 }
    );
  }
}

// PUT - Update a partner
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Partner ID is required" },
        { status: 400 }
      );
    }

    const updatedPartner = await Partner.findOneAndUpdate(
      { id: parseInt(id) },
      updateData,
      { new: true }
    );

    if (!updatedPartner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPartner);
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json(
      { error: "Failed to update partner" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a partner
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Partner ID is required" },
        { status: 400 }
      );
    }

    const deletedPartner = await Partner.findOneAndDelete({ id: parseInt(id) });

    if (!deletedPartner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Partner deleted successfully" });
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json(
      { error: "Failed to delete partner" },
      { status: 500 }
    );
  }
}