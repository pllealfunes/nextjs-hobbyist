"use server";

import { createClient } from "@/utils/supabase/server";

export async function getLatestFeedPosts({ page = 1, pageSize = 3 }) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // // Fetch total count
    const { data: followedUsers, error: followsErrors } = await supabase
      .from("Follows")
      .select("*", { count: "exact" })
      .eq("follower_id", user.id)
      .order("created_at", { ascending: false });

    if (followsErrors) {
      throw new Error(
        `Error fetching latest users posts: ${followsErrors.message}`
      );
    }

    // Fetch total count
    const { data: followedCategories, error: categoryErrors } = await supabase
      .from("CategoryFollows")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (categoryErrors) {
      throw new Error(
        `Error fetching latest category posts: ${categoryErrors.message}`
      );
    }

    const followedUserIds = followedUsers
      .map((f) => f.followed_id)
      .filter((id) => typeof id === "string" && id.length > 0);

    const followedCategoryIds = followedCategories
      .map((c) => c.category_id)
      .filter((id) => typeof id === "string" && id.length > 0);

    const { data: userPosts, error: errorUsers } = await supabase
      .from("Post")
      .select("*")
      .in("author_id", followedUserIds)
      .range(start, end);

    const { data: categoryPosts, error: errorCategory } = await supabase
      .from("Post")
      .select("*")
      .in("category_id", followedCategoryIds)
      .range(start, end);

    if (errorUsers || errorCategory) {
      const userErrorMsg = errorUsers?.message ?? "No user post error";
      const categoryErrorMsg =
        errorCategory?.message ?? "No category post error";

      throw new Error(
        `Error fetching latest posts for feed:\nUser error: ${userErrorMsg}\nCategory error: ${categoryErrorMsg}`
      );
    }
    console.log("Followed user IDs:", followedUserIds);
    console.log("Followed category IDs:", followedCategoryIds);

    const combinedPosts = Array.from(new Set([...categoryPosts, ...userPosts]));
    const uniquePosts = Array.from(
      new Map(combinedPosts.map((p) => [p.id, p])).values()
    );
    const sortedPosts = uniquePosts.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const paginatedPosts = sortedPosts.slice(start, end + 1);

    const authorIds = paginatedPosts?.map((p) => p.author_id).filter(Boolean);
    if (!authorIds.length) {
      //   return { success: true, posts, totalCount: count };
    }

    // ✅ Total count for pagination
    const count = sortedPosts.length;

    console.log("Combined posts:", combinedPosts);
    console.log("Unique posts:", uniquePosts);
    console.log("Sorted posts:", sortedPosts);
    console.log("Paginated posts:", paginatedPosts);
    console.log("Author IDs:", authorIds);

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
    console.log("Users:", users);
    console.log("Profiles:", profiles);
    // Enrich posts
    const enrichedPosts = paginatedPosts.map((post) => {
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

export async function getMatchingFeedPosts({
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
