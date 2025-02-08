import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    console.log("Fetching posts...");
    let { data: posts, error } = await supabase
      .from("Post")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    console.log("Posts fetched:", posts);
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts", details: error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      console.log("Creating a new post...");
      const { title, categoryId, content } = await req.json();
      const post = await prisma.post.create({
        data: {
          title,
          categoryId,
          content,
        },
      });
      console.log("Post created:", post);
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
