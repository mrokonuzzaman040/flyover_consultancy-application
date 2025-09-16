import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import SuccessStory from "@/lib/models/SuccessStory";

// GET - Fetch a single success story by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const story = await SuccessStory.findOne({ storyId: parseInt(id) });
    
    if (!story) {
      return NextResponse.json(
        { error: "Success story not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ successStory: story });
  } catch (error) {
    console.error("Error fetching success story:", error);
    return NextResponse.json(
      { error: "Failed to fetch success story" },
      { status: 500 }
    );
  }
}

// PUT - Update a single success story by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const updatedStory = await SuccessStory.findOneAndUpdate(
      { storyId: parseInt(id) },
      body,
      { new: true }
    );

    if (!updatedStory) {
      return NextResponse.json(
        { error: "Success story not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error("Error updating success story:", error);
    return NextResponse.json(
      { error: "Failed to update success story" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a single success story by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const deletedStory = await SuccessStory.findOneAndDelete({ storyId: parseInt(id) });

    if (!deletedStory) {
      return NextResponse.json(
        { error: "Success story not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Success story deleted successfully" });
  } catch (error) {
    console.error("Error deleting success story:", error);
    return NextResponse.json(
      { error: "Failed to delete success story" },
      { status: 500 }
    );
  }
}