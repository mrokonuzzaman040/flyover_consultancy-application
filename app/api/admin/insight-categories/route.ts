import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import InsightCategory from "@/lib/models/InsightCategory";

interface InsightCategoryData {
  id: string;
  name: string;
  count: number;
  slug: string;
}

// GET - Fetch all insight categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await InsightCategory.find().sort({ count: -1 });
    
    const categoriesData: InsightCategoryData[] = categories.map((category) => ({
      id: category._id.toString(),
      name: category.name,
      count: category.count,
      slug: category.slug,
    }));

    return NextResponse.json({ categories: categoriesData });
  } catch (error) {
    console.error("Error fetching insight categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch insight categories" },
      { status: 500 }
    );
  }
}

// POST - Create a new insight category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, count = 0 } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const newCategory = new InsightCategory({
      name,
      count: parseInt(count) || 0,
    });

    const savedCategory = await newCategory.save();

    const categoryData: InsightCategoryData = {
      id: savedCategory._id.toString(),
      name: savedCategory.name,
      count: savedCategory.count,
      slug: savedCategory.slug,
    };

    return NextResponse.json(categoryData, { status: 201 });
  } catch (error) {
    console.error("Error creating insight category:", error);
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create insight category" },
      { status: 500 }
    );
  }
}

// PUT - Update an insight category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, count } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "Category ID and name are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const updatedCategory = await InsightCategory.findByIdAndUpdate(
      id,
      {
        name,
        count: parseInt(count) || 0,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const categoryData: InsightCategoryData = {
      id: updatedCategory._id.toString(),
      name: updatedCategory.name,
      count: updatedCategory.count,
      slug: updatedCategory.slug,
    };

    return NextResponse.json(categoryData);
  } catch (error) {
    console.error("Error updating insight category:", error);
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: "Another category with this name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update insight category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an insight category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedCategory = await InsightCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting insight category:", error);
    return NextResponse.json(
      { error: "Failed to delete insight category" },
      { status: 500 }
    );
  }
}