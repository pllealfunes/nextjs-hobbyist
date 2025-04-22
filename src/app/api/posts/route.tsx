import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    console.log("Fetching posts...");

    // Initialize the Supabase client
    const supabase = await createClient();

    const { data: posts, error } = await supabase
      .from("Post")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    if (!posts || posts.length === 0)
      throw new Error("No posts published found");

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      console.log("Creating a new post...");
      const { title, category_id, coverphoto, content, published } =
        await req.json();

      // Initialize the Supabase client
      const supabase = await createClient();

      // Fetch the authenticated user directly from Supabase
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Insert the new post into Supabase
      const { data, error } = await supabase
        .from("Post")
        .insert([
          {
            title,
            category_id,
            author_id: user.id,
            coverphoto,
            content,
            published,
          },
        ])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      console.log("Post created:", data);
      return NextResponse.json(data[0], { status: 201 });
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
  }
}
