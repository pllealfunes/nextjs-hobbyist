import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = await params; // Get the post ID from the URL
    const updatedFields = await req.json(); // Parse the request body (JSON payload)

    // Validate postId
    if (!postId || typeof postId !== "string" || postId.trim() === "") {
      throw new Error("Invalid or missing postId");
    }

    // Ensure coverphoto is null if it's undefined or explicitly deleted
    if (updatedFields.coverphoto === undefined) {
      updatedFields.coverphoto = null; // Set coverphoto to null if undefined
    }

    // Initialize Supabase client
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update the post in the database
    const { data, error } = await supabase
      .from("Post") // Replace with your table name
      .update(updatedFields) // Update the fields received from the client
      .eq("id", postId) // Match the post ID
      .eq("author_id", user.id) // Only allow updates to their own posts
      .select("*"); // Fetch the updated post to return to the client

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("No post found to update");

    return NextResponse.json(data[0], { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);

    // Type guard to check if error is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fallback if error is not an instance of Error
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;

    if (!postId || typeof postId !== "string" || postId.trim() === "") {
      return NextResponse.json(
        { error: "Invalid or missing postId" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("Post")
      .delete()
      .eq("id", postId)
      .eq("author_id", user.id)
      .select("*");

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Post not found or not authorized" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Post deleted", post: data[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
