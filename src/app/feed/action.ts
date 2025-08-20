"use server";

import { postsWithUserData } from "@/lib/getLatestPosts";
import { getPaginationRange } from "@/utils/paginationRage";
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

    const { start, end } = getPaginationRange(page, pageSize);

    // Fetch total count
    const [followsRes, categoriesRes] = await Promise.all([
      supabase.from("Follows").select("follower_id").eq("follower_id", user.id),
      supabase
        .from("CategoryFollows")
        .select("category_id")
        .eq("user_id", user.id),
    ]);

    if (followsRes.error || categoriesRes.error) {
      throw new Error(
        `Error fetching follows:\nUser: ${followsRes.error?.message}\nCategory: ${categoriesRes.error?.message}`
      );
    }

    const followedUserIds = followsRes.data
      .map((follower) => follower.follower_id)
      .filter(Boolean);

    const followedCategoryIds = categoriesRes.data
      .map((category) => category.category_id)
      .filter(Boolean);

    if (!followedUserIds.length && !followedCategoryIds.length) {
      return { success: true, posts: [], totalCount: 0 };
    }

    const [userPostsRes, categoryPostsRes] = await Promise.all([
      supabase.from("Post").select("*").in("author_id", followedUserIds),
      supabase.from("Post").select("*").in("category_id", followedCategoryIds),
    ]);

    if (userPostsRes.error || categoryPostsRes.error) {
      throw new Error(
        `Error fetching posts:\nUser: ${userPostsRes.error?.message}\nCategory: ${categoryPostsRes.error?.message}`
      );
    }

    // Merge, deduplicate, and sort posts
    const combinedPosts = [...userPostsRes.data, ...categoryPostsRes.data];
    const uniquePosts = Array.from(
      new Map(combinedPosts.map((p) => [p.id, p])).values()
    );
    const sortedPosts = uniquePosts.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const paginatedPosts = sortedPosts.slice(start, end + 1);
    const authorIds = paginatedPosts.map((p) => p.author_id).filter(Boolean);
    const totalCount = sortedPosts.length;

    if (!authorIds.length) {
      return { success: true, posts: [], totalCount };
    }

    // Get posts with user profiles
    const latestPosts = await postsWithUserData(paginatedPosts);

    return { success: true, posts: latestPosts, totalCount };
  } catch (error) {
    console.error("❌ Error fetching latest feed posts:", error);
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

    if (error) {
      throw new Error(`Error fetching latest posts: ${error.message}`);
    }

    const authorIds = data?.map((p) => p.author_id).filter(Boolean);
    if (!authorIds?.length) {
      return { success: true, data, totalCount: count };
    }

    // Get posts with user profiles
    const matchingPosts = await postsWithUserData(data);

    return {
      success: true,
      posts: matchingPosts ?? [],
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
