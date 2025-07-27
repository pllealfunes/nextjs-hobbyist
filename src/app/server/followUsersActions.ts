"use server";
import { createClient } from "@/utils/supabase/server";

export async function getUserConnections(userId: string) {
  const supabase = await createClient();

  if (!userId) {
    throw new Error("No User Id Provided");
  }

  // Step 1: Get all follow relationships where the user is either follower or following
  const { data: follows, error: followsError } = await supabase
    .from("Follows")
    .select("follower_id, following_id")
    .or(`follower_id.eq.${userId},following_id.eq.${userId}`);

  if (followsError) {
    throw new Error(
      `Error fetching follow relationships: ${followsError.message}`
    );
  }

  // Step 2: Separate following and follower IDs
  const followingIds = follows
    .filter((f) => f.follower_id === userId)
    .map((f) => f.following_id);

  const followerIds = follows
    .filter((f) => f.following_id === userId)
    .map((f) => f.follower_id);

  const uniqueUserIds = Array.from(new Set([...followingIds, ...followerIds]));

  // Step 3: Fetch user info
  const { data: users, error: usersError } = await supabase
    .from("User")
    .select("id, name, username")
    .in("id", uniqueUserIds);

  if (usersError) {
    throw new Error(`Error fetching user data: ${usersError.message}`);
  }

  // Step 4: Fetch profile photos
  const { data: profiles, error: profilesError } = await supabase
    .from("Profile")
    .select("id, photo")
    .in("id", uniqueUserIds);

  if (profilesError) {
    throw new Error(`Error fetching profile photos: ${profilesError.message}`);
  }

  // Step 5: Merge user and profile data
  const usersWithProfiles = users.map((user) => {
    const profile = profiles.find((p) => p.id === user.id);
    return {
      ...user,
      photo: profile?.photo || null,
    };
  });

  // Step 6: Separate into following and followers
  const following = usersWithProfiles
    .filter((user) => followingIds.includes(user.id))
    .map((user) => ({ ...user, isFollowing: true }));

  const followers = usersWithProfiles
    .filter((user) => followerIds.includes(user.id))
    .map((user) => ({
      ...user,
      isFollowing: followingIds.includes(user.id), // true if mutual
    }));

  return { following, followers };
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

export async function removeFollower(followerId: string) {
  const supabase = await createClient();

  if (!followerId) {
    throw new Error("User Follower ID is required");
  }

  // Step 1: Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Step 2: Delete the follow relationship where the current user is being followed
  const { data, error: deleteError } = await supabase
    .from("Follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", user.id); // User wants to remove a follower

  console.log(user.id, data, typeof user.id);

  if (deleteError) {
    throw new Error(`Error removing follower: ${deleteError.message}`);
  }

  return true; // Successfully removed
}
