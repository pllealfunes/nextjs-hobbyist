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

export async function getLatestPosts() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("Post")
      .select("*")
      .order("created_at", { ascending: false }) // Latest posts first
      .limit(3); // Limit results for performance

    if (error) throw new Error(`Error fetching latest posts: ${error.message}`);

    console.log("📌 Latest posts retrieved:", data);

    return { success: true, posts: data };
  } catch (error) {
    console.error("❌ Error fetching latest posts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

export async function getMatchingPosts({
  search,
  category,
}: {
  search: string;
  category?: number;
}) {
  try {
    const supabase = await createClient();

    let query = supabase.from("Post").select("*");

    // Apply search filter if provided
    if (search) {
      query = query.ilike("title", `%${search}%`); // Case-insensitive match
    }
    console.log(category);

    // Apply category filter if provided
    if (category !== undefined && category !== null) {
      query = query.eq("category_id", category);
    }

    if (!search && !category) {
      throw new Error("Error fetching posts");
    }

    const { data, error } = await query;

    if (error) throw new Error(`Error fetching posts: ${error.message}`);

    console.log("📌 Found posts", data);

    return { success: true, posts: data };
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
