import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import SuccessStory from "@/lib/models/SuccessStory";

// GET - Fetch all success stories
export async function GET() {
  try {
    await dbConnect();
    const stories = await SuccessStory.find().sort({ id: 1 });
    
    // Transform the data to match the expected interface
    const transformedStories = stories.map(story => ({
      _id: story._id,
      storyId: story.storyId || 0,
      rating: story.rating,
      text: story.text,
      author: story.author,
      university: story.university,
      program: story.program,
      country: story.country,
      scholarship: story.scholarship,
      year: story.year,
      avatar: story.avatar,
      flag: story.flag,
      color: story.color,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt
    }));
    
    return NextResponse.json({ successStories: transformedStories });
  } catch (error) {
    console.error("Error fetching success stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch success stories" },
      { status: 500 }
    );
  }
}

// POST - Create a new success story
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const {
      author,
      university,
      country,
      program,
      text,
      rating,
      year,
      scholarship,
      avatar,
      flag,
      color
    } = body;

    // Validate required fields
    if (!author || !university || !country || !program || !text) {
      return NextResponse.json(
        { error: "Author, university, country, program, and text are required" },
        { status: 400 }
      );
    }

    // Get the next ID
    const lastStory = await SuccessStory.findOne().sort({ storyId: -1 });
    const nextStoryId = lastStory ? lastStory.storyId + 1 : 1;

    const newStory = new SuccessStory({
      storyId: nextStoryId,
      rating: rating || 5,
      text,
      author,
      university,
      program,
      country,
      scholarship: scholarship || "No Scholarship",
      year: year || new Date().getFullYear().toString(),
      avatar: avatar || author.substring(0, 2).toUpperCase(),
      flag: flag || "🌍",
      color: color || "from-blue-600 to-blue-800"
    });

    await newStory.save();
    return NextResponse.json(newStory, { status: 201 });
  } catch (error) {
    console.error("Error creating success story:", error);
    return NextResponse.json(
      { error: "Failed to create success story" },
      { status: 500 }
    );
  }
}

// PUT - Update a success story
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Success story ID is required" },
        { status: 400 }
      );
    }

    const updatedStory = await SuccessStory.findOneAndUpdate(
      { storyId: parseInt(id) },
      updateData,
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

// DELETE - Delete a success story
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Success story ID is required" },
        { status: 400 }
      );
    }

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