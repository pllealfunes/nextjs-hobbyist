"use server";
import { createClient } from "@/utils/supabase/server";

export async function getFollowingUsers(userId: string) {
  const supabase = await createClient();

  if (!userId) {
    throw new Error("No User Id Provided");
  }

  // Step 1: Get following IDs
  const { data: follows, error: followsError } = await supabase
    .from("Follows")
    .select("following_id")
    .eq("follower_id", userId);

  if (followsError) {
    throw new Error(`Error fetching followed users: ${followsError.message}`);
  }

  const followingIds = follows.map((f) => f.following_id);

  // Step 2: Get users
  const { data: users, error: usersError } = await supabase
    .from("User")
    .select("id, name, username")
    .in("id", followingIds);

  if (usersError) {
    throw new Error(`Error fetching user profiles: ${usersError.message}`);
  }

  // Step 3: Get profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("Profile")
    .select("photo")
    .in("id", followingIds);

  if (profilesError) {
    throw new Error(`Error fetching user profiles: ${profilesError.message}`);
  }

  // Step 3: Add isFollowing flag
  const followedProfiles = users.map((user) => ({
    ...user,
    ...profiles,
    isFollowing: true,
  }));

  return followedProfiles;
}

export async function followUserState(followingId: string) {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  console.log("Follow User State", followingId);

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

export async function toggleFollowUser(followId: string) {
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

  if (user.id === followId) {
    throw new Error("You cannot follow yourself.");
  }

  // Check if user is following the user
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
      .eq("follower_id", user.id)
      .eq("following_id", followId);

    if (unfollowError) {
      throw new Error(`Error unfollowing category: ${unfollowError.message}`);
    }

    return false; // Unfollowed successfully
  } else {
    // User is NOT following → Follow (Insert record)
    const { error: followError } = await supabase
      .from("Follows")
      .insert([{ follower_id: user.id, following_id: followId }]);

    if (followError) {
      throw new Error(`Error following user: ${followError.message}`);
    }

    return true; // Followed successfully
  }
}
