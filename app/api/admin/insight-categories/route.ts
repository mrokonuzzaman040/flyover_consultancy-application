import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { HomeSettings } from "@/lib/models/HomeSettings";

interface InsightCategory {
  id: string;
  name: string;
  count: number;
}

interface DatabaseInsightCategory {
  name: string;
  count: number;
}

async function getHomeSettings() {
  await dbConnect();
  let homeSettings = await HomeSettings.findOne();
  
  if (!homeSettings) {
    homeSettings = new HomeSettings({
      insightCategories: []
    });
    await homeSettings.save();
  }
  
  return homeSettings;
}

// GET - Fetch all insight categories
export async function GET() {
  try {
    const homeSettings = await getHomeSettings();
    
    const categories: InsightCategory[] = homeSettings.insightCategories.map(
      (category: DatabaseInsightCategory, index: number) => ({
        id: `category-${index + 1}`,
        name: category.name,
        count: category.count,
      })
    );

    return NextResponse.json({ categories });
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

    const homeSettings = await getHomeSettings();
    
    // Check if category already exists
    const existingCategory = homeSettings.insightCategories.find(
      (cat: DatabaseInsightCategory) => cat.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    const newCategory: DatabaseInsightCategory = {
      name,
      count: parseInt(count) || 0,
    };

    homeSettings.insightCategories.push(newCategory);
    await homeSettings.save();

    const savedCategory: InsightCategory = {
      id: `category-${homeSettings.insightCategories.length}`,
      name: newCategory.name,
      count: newCategory.count,
    };

    return NextResponse.json(savedCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating insight category:", error);
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

    const homeSettings = await getHomeSettings();
    const categoryIndex = parseInt(id.replace('category-', '')) - 1;

    if (categoryIndex < 0 || categoryIndex >= homeSettings.insightCategories.length) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if another category with the same name exists (excluding current)
    const existingCategory = homeSettings.insightCategories.find(
      (cat: DatabaseInsightCategory, index: number) => 
        cat.name.toLowerCase() === name.toLowerCase() && index !== categoryIndex
    );
    
    if (existingCategory) {
      return NextResponse.json(
        { error: "Another category with this name already exists" },
        { status: 400 }
      );
    }

    homeSettings.insightCategories[categoryIndex] = {
      name,
      count: parseInt(count) || 0,
    };

    await homeSettings.save();

    const updatedCategory: InsightCategory = {
      id,
      name,
      count: parseInt(count) || 0,
    };

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating insight category:", error);
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

    const homeSettings = await getHomeSettings();
    const categoryIndex = parseInt(id.replace('category-', '')) - 1;

    if (categoryIndex < 0 || categoryIndex >= homeSettings.insightCategories.length) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Allow deleting any category as all data comes from database

    homeSettings.insightCategories.splice(categoryIndex, 1);
    await homeSettings.save();

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting insight category:", error);
    return NextResponse.json(
      { error: "Failed to delete insight category" },
      { status: 500 }
    );
  }
}