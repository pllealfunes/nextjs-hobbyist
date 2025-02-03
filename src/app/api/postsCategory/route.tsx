import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");

  try {
    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    const posts = await prisma.post.findMany({
      where: {
        category: {
          name: {
            equals: category,
            mode: "insensitive", // Make the search case-insensitive
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Order posts from newest to oldest
      },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}
