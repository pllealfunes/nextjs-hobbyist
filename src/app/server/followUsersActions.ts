"use server";
import { createClient } from "@/utils/supabase/server";

export async function getFollowedUsers() {
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
    .from("Follows")
    .select("following_id")
    .eq("follower_id", user.id);

  if (error) {
    throw new Error(`Error fetching followed categories: ${error.message}`);
  }

  return data.map((entry) => entry.following_id);
}

export async function followUserState(followingId: number) {
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
    .from("Follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", followingId);

  if (error) {
    throw new Error(`Error fetching follow state: ${error.message}`);
  }

  return !!data?.length;
}

export async function toggleFollowuser(followId: number) {
  const supabase = await createClient();

  if (!followId) {
    throw new Error("User Follow ID is required");
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
    .from("Follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", followId);

  if (error) {
    throw new Error(`Error fetching follow status: ${error.message}`);
  }

  if (data && data.length > 0) {
    const { error: unfollowError } = await supabase
      .from("Follows")
      .delete()
      .eq("follow_id", user.id)
      .eq("following_id", followId);

    if (unfollowError) {
      throw new Error(`Error unfollowing category: ${unfollowError.message}`);
    }

    return false; // Unfollowed successfully
  } else {
    // User is NOT following → Follow (Insert record)
    const { error: followError } = await supabase
      .from("CategoryFollows")
      .insert([{ follow_id: user.id, follower_id: followId }]);

    if (followError) {
      throw new Error(`Error following user: ${followError.message}`);
    }

    return true; // Followed successfully
  }
}
