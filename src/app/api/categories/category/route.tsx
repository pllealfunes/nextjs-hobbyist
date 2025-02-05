import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure Prisma is correctly imported

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryName = searchParams.get("category");

    if (!categoryName) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // Find category by name
    const categoryData = await prisma.category.findUnique({
      where: { name: categoryName },
      select: { id: true },
    });

    if (!categoryData) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Find posts by categoryId
    const posts = await prisma.post.findMany({
      where: { categoryId: categoryData.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
