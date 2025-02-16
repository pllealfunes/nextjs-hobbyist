import { NextRequest, NextResponse } from "next/server";
//import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    console.log("Fetching posts...");

    // Initialize the Supabase client
    const supabase = await createClient();

    const { data: posts, error } = await supabase
      .from("Post")
      .select("*")
      .order("created_at", { ascending: false });
    console.log(posts);

    if (error) throw error;

    console.log("Posts fetched:", posts);
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
      const { title, category_id, content } = await req.json();

      // Initialize the Supabase client
      const supabase = await createClient();

      // Fetch the authenticated user directly from Supabase
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Insert the new post into Supabase
      const { data, error } = await supabase
        .from("Post") // Replace with your table name
        .insert([{ title, category_id, author_id: user.id, content }]);

      if (error) {
        throw new Error(error.message);
      }

      console.log("Post created:", data);
      return NextResponse.json(data, { status: 201 });
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
