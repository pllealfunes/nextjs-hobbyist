"use server";
import { createClient } from "@/utils/supabase/server";

export async function getCategoryWithPosts(categoryName: string) {
  try {
    const supabase = await createClient();

    if (!categoryName) {
      throw new Error("Category name is required");
    }

    // Format the category string
    const capitalizeFirstLetter = (str: string) => {
      if (str.toLowerCase() === "games+puzzles") return "Games+Puzzles";
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const formattedCategory = capitalizeFirstLetter(
      decodeURIComponent(categoryName.replace(/-/g, "+"))
    );
    console.log(categoryName);

    // Fetch category
    const { data: categoryData, error: categoryError } = await supabase
      .from("Category")
      .select("*")
      .eq("name", formattedCategory)
      .maybeSingle();
    console.log(categoryName);
    if (categoryError)
      throw new Error(`Error fetching category: ${categoryError.message}`);
    if (!categoryData) throw new Error("Category not found");

    // Fetch posts
    const { data: posts, error: postsError } = await supabase
      .from("Post")
      .select("*")
      .eq("category_id", categoryData.id)
      .order("created_at", { ascending: false });

    if (postsError)
      throw new Error(`Error fetching posts: ${postsError.message}`);

    const authorIds = posts?.map((p) => p.author_id).filter(Boolean);
    if (!authorIds.length) {
      return { success: true, posts: [] };
    }

    const { data: users, error: userError } = await supabase
      .from("User")
      .select("id, username")
      .in("id", authorIds);

    if (userError) {
      throw new Error(`Error fetching users: ${userError.message}`);
    }

    const { data: profiles, error: profileError } = await supabase
      .from("Profile")
      .select("id, photo")
      .in("id", authorIds);

    if (profileError) {
      throw new Error(`Error fetching profiles: ${profileError.message}`);
    }

    const enrichedPosts = posts.map((post) => {
      return {
        ...post,
        user: users.find((u) => u.id === post.author_id) || {
          id: post.author_id,
          username: "Unknown User",
        },
        profile: profiles.find((p) => p.id === post.author_id) || {
          id: post.author_id,
          photo: null,
        },
      };
    });

    return { success: true, posts: enrichedPosts };
  } catch (error) {
    console.error("❌ Error fetching category with posts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

export async function getFollowedCategories(profileId: string) {
  const supabase = await createClient();

  if (!profileId) {
    throw new Error("Unauthorized");
  }
  // Fetch all followed categories by user
  const { data, error } = await supabase
    .from("CategoryFollows")
    .select("category_id")
    .eq("user_id", profileId);

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
