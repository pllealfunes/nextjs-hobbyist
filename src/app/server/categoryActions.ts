"use server";
import { createClient } from "@/utils/supabase/server";

export async function getCategoryWithPosts(categoryName: string) {
  try {
    const supabase = await createClient();

    // Validate category input
    if (!categoryName) {
      throw new Error("Category name is required");
    }

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

    // Fetch posts filtered by categoryId
    const { data: posts, error: postsError } = await supabase
      .from("Post")
      .select("*")
      .eq("category_id", categoryData.id)
      .order("created_at", { ascending: false });

    if (postsError)
      throw new Error(`Error fetching posts: ${postsError.message}`);

    return { success: true, category: categoryData, posts };
  } catch (error) {
    console.error("❌ Error fetching category with posts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

export async function getFollowedCategories() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }
  // Fetch all followed categories by user
  const { data, error } = await supabase
    .from("CategoryFollows")
    .select("category_id")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Error fetching followed categories: ${error.message}`);
  }

  return data.map((entry) => entry.category_id);
}

export async function fetchFollowState(categoryId: number) {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }
  const { data, error } = await supabase
    .from("CategoryFollows")
    .select("id")
    .eq("user_id", user.id)
    .eq("category_id", categoryId);

  if (error) {
    throw new Error(`Error fetching follow state: ${error.message}`);
  }

  return !!data?.length;
}

export async function toggleFollowCategory(categoryId: number) {
  const supabase = await createClient();

  if (!categoryId) {
    throw new Error("Category ID is required");
  }

  // Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Check if user is following the category
  const { data, error } = await supabase
    .from("CategoryFollows")
    .select("id")
    .eq("user_id", user.id)
    .eq("category_id", categoryId);

  if (error) {
    throw new Error(`Error fetching follow status: ${error.message}`);
  }

  if (data && data.length > 0) {
    const { error: unfollowError } = await supabase
      .from("CategoryFollows")
      .delete()
      .eq("user_id", user.id)
      .eq("category_id", categoryId);

    if (unfollowError) {
      throw new Error(`Error unfollowing category: ${unfollowError.message}`);
    }

    return false; // Unfollowed successfully
  } else {
    // User is NOT following → Follow (Insert record)
    const { error: followError } = await supabase
      .from("CategoryFollows")
      .insert([{ user_id: user.id, category_id: categoryId }]);

    if (followError) {
      throw new Error(`Error following category: ${followError.message}`);
    }

    return true; // Followed successfully
  }
}
