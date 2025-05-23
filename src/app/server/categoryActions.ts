"use server";
import { createClient } from "@/utils/supabase/server";

export async function getCategoryWithPosts(categoryName: string) {
  try {
    const supabase = await createClient();

    // Validate category input
    if (!categoryName) {
      throw new Error("Category name is required");
    }

    console.log("🔍 Fetching category:", categoryName);

    // Format category name
    const capitalizeFirstLetter = (str: string) => {
      if (str.toLowerCase() === "games+puzzles") {
        return "Games+Puzzles";
      }
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const formattedCategory = capitalizeFirstLetter(
      decodeURIComponent(categoryName.replace(/-/g, "+"))
    );

    // Fetch category data
    const { data: categoryData, error: categoryError } = await supabase
      .from("Category")
      .select("*")
      .eq("name", formattedCategory)
      .maybeSingle(); // ✅ Ensures only one result or null

    if (categoryError)
      throw new Error(`Error fetching category: ${categoryError.message}`);
    if (!categoryData) throw new Error("Category not found");

    console.log("📌 Found category data:", categoryData);

    // Fetch posts filtered by categoryId
    const { data: posts, error: postsError } = await supabase
      .from("Post")
      .select("*")
      .eq("category_id", categoryData.id)
      .order("created_at", { ascending: false });

    if (postsError)
      throw new Error(`Error fetching posts: ${postsError.message}`);

    console.log(
      `✅ Found ${posts.length} posts for category '${formattedCategory}'`
    );

    return { success: true, category: categoryData, posts };
  } catch (error) {
    console.error("❌ Error fetching category with posts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
