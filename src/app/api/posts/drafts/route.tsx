import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // Adjust import based on your setup

export async function POST(req: NextRequest) {
  try {
    const { title, category_id, content, coverphoto, published } =
      await req.json();

    const supabase = await createClient();

    // Fetch authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error(userError?.message || "User not authenticated");
    }

    // Insert the new post
    const { data, error } = await supabase
      .from("POST") // Ensure table name matches your database
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
