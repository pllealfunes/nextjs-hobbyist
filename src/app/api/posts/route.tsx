import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.post.findMany();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const { title, categoryId, content } = await req.json();
      const post = await prisma.post.create({
        data: {
          title,
          categoryId,
          content,
        },
      });
      return NextResponse.json(post, { status: 201 });
    } catch (error: unknown) {
      let errorMessage = "Unknown error";

      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
      } else {
        console.error("Unexpected error:", error);
      }

      return NextResponse.json(
        { error: "Error creating post", message: errorMessage },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
