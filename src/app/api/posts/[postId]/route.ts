import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId; // Get the post ID from the URL
    const updatedFields = await req.json(); // Parse the request body (JSON payload)

    console.log("Post ID:", postId);
    console.log("Updated Fields:", updatedFields);
    console.log(typeof postId);

    // Validate postId
    if (!postId || typeof postId !== "string" || postId.trim() === "") {
      throw new Error("Invalid or missing postId");
    }

    // Initialize Supabase client
    const supabase = await createClient();

    // Update the post in the database
    const { data, error } = await supabase
      .from("Post") // Replace with your table name
      .update(updatedFields) // Update the fields received from the client
      .eq("id", postId) // Match the post ID
      .select("*"); // Fetch the updated post to return to the client

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("No post found to update");

    console.log("Post updated:", data[0]);

    return NextResponse.json(data[0], { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
