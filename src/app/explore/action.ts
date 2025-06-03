"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAllPosts() {
  try {
    const supabase = await createClient();

    // Fetch post data by ID
    const { data, error } = await supabase.from("Post").select("*");

    if (error) throw new Error(`Error fetching post: ${error.message}`);

    console.log("📌 Found posts");

    return { success: true, posts: data };
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
