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

export async function getLatestPosts({ page = 1, pageSize = 3 }) {
  try {
    const supabase = await createClient();

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // Fetch total count
    const { count } = await supabase
      .from("Post")
      .select("*", { count: "exact" });

    // Fetch paginated posts
    const { data: posts, error: postsError } = await supabase
      .from("Post")
      .select("*")
      .order("created_at", { ascending: false })
      .range(start, end);

    if (postsError) {
      throw new Error(`Error fetching latest posts: ${postsError.message}`);
    }

    const authorIds = posts?.map((p) => p.author_id).filter(Boolean);
    if (!authorIds.length) {
      return { success: true, posts, totalCount: count };
    }

    // Fetch related users
    const { data: users, error: userError } = await supabase
      .from("User")
      .select("id, username")
      .in("id", authorIds);

    if (userError) {
      throw new Error(`Error fetching users: ${userError.message}`);
    }

    // Fetch related profiles
    const { data: profiles, error: profileError } = await supabase
      .from("Profile")
      .select("id, photo")
      .in("id", authorIds);

    if (profileError) {
      throw new Error(`Error fetching profiles: ${profileError.message}`);
    }

    // Enrich posts
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

    return { success: true, posts: enrichedPosts, totalCount: count };
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
  page = 1,
  pageSize = 5,
}: {
  search: string;
  category?: number;
  page?: number;
  pageSize?: number;
}) {
  try {
    const supabase = await createClient();

    let searchQuery = supabase.from("Post").select("*", { count: "exact" });

    const searchTerm = search?.trim();
    const searchCategory = typeof category === "number" && category > 0;

    if (searchTerm) {
      searchQuery = searchQuery.ilike("title", `%${searchTerm.trim()}%`);
    }

    if (searchCategory) {
      searchQuery = searchQuery.eq("category_id", category);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    searchQuery = searchQuery.range(from, to);

    const { data, error, count } = await searchQuery;

    return {
      success: true,
      posts: data ?? [],
      totalCount: count ?? 0,
    };
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
