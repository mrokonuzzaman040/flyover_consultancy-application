import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Insight from "@/lib/models/Insight";

// GET - Fetch all insights
export async function GET() {
  try {
    await dbConnect();
    const insights = await Insight.find().sort({ id: 1 });
    
    // Transform the data to match the expected interface
    const transformedInsights = insights.map(insight => ({
      _id: insight._id,
      id: insight.id || insight.insightId || 0, // Handle both id and insightId
      category: insight.category,
      categoryColor: insight.categoryColor,
      author: insight.author,
      authorRole: insight.authorRole,
      readTime: insight.readTime,
      publishedAt: insight.publishedAt || insight.publishDate || insight.createdAt,
      title: insight.title,
      excerpt: insight.excerpt,
      content: insight.content || insight.excerpt, // Use excerpt as content if content is missing
      image: insight.image,
      featured: insight.featured || false,
      views: insight.views || 0,
      likes: insight.likes || 0,
      tags: insight.tags || [],
      slug: insight.slug,
      createdAt: insight.createdAt,
      updatedAt: insight.updatedAt
    }));
    
    return NextResponse.json({ insights: transformedInsights });
  } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json(
      { error: "Failed to fetch insights" },
      { status: 500 }
    );
  }
}

// POST - Create a new insight
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const {
      category,
      categoryColor,
      author,
      authorRole,
      readTime,
      publishDate,
      title,
      excerpt,
      content,
      image,
      featured = false,
      views = "0",
      likes = "0",
      tags = []
    } = body;

    // Validate required fields
    if (!category || !author || !title || !excerpt || !content) {
      return NextResponse.json(
        { error: "Category, author, title, excerpt, and content are required" },
        { status: 400 }
      );
    }

    // Get the next ID
    const lastInsight = await Insight.findOne().sort({ id: -1 });
    const nextId = lastInsight ? lastInsight.id + 1 : 1;

    const newInsight = new Insight({
      id: nextId,
      category,
      categoryColor: categoryColor || "bg-gray-100 text-gray-800",
      author,
      authorRole: authorRole || "Content Writer",
      readTime: readTime || "5 min read",
      publishedAt: publishDate ? new Date(publishDate) : new Date(),
      title,
      excerpt,
      content: content || excerpt, // Use excerpt as content if content not provided
      image: image || "📝",
      featured,
      views: parseInt(views) || 0,
      likes: parseInt(likes) || 0,
      tags: Array.isArray(tags) ? tags : [category] // Use category as default tag
    });

    await newInsight.save();
    return NextResponse.json(newInsight, { status: 201 });
  } catch (error) {
    console.error("Error creating insight:", error);
    return NextResponse.json(
      { error: "Failed to create insight" },
      { status: 500 }
    );
  }
}

// PUT - Update an insight
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Insight ID is required" },
        { status: 400 }
      );
    }

    const updatedInsight = await Insight.findOneAndUpdate(
      { id: parseInt(id) },
      updateData,
      { new: true }
    );

    if (!updatedInsight) {
      return NextResponse.json(
        { error: "Insight not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedInsight);
  } catch (error) {
    console.error("Error updating insight:", error);
    return NextResponse.json(
      { error: "Failed to update insight" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an insight
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Insight ID is required" },
        { status: 400 }
      );
    }

    const deletedInsight = await Insight.findOneAndDelete({ id: parseInt(id) });

    if (!deletedInsight) {
      return NextResponse.json(
        { error: "Insight not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Insight deleted successfully" });
  } catch (error) {
    console.error("Error deleting insight:", error);
    return NextResponse.json(
      { error: "Failed to delete insight" },
      { status: 500 }
    );
  }
}