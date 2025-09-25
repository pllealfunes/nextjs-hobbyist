"use server";
import { createClient } from "@/utils/supabase/server";

export async function likePostState(postId: string) {
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
    .from("Like")
    .select("user_id")
    .eq("post_id", postId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  return {
    count: data.length,
    liked: data.some((like) => like.user_id === user.id),
  };
}

export async function toggleLikePost(postId: string) {
  const supabase = await createClient();

  if (!postId) {
    throw new Error("Post ID is required");
  }

  // Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Check if user has already liked the post
  const { data, error } = await supabase
    .from("Like")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Error checking like status: ${error.message}`);
  }

  if (data && data.length > 0) {
    // User has liked → remove like
    const { error: unlikeError } = await supabase
      .from("Like")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);

    if (unlikeError) {
      throw new Error(`Error unliking post: ${unlikeError.message}`);
    }

    return false; // Unliked successfully
  } else {
    // User has not liked → add like
    const { error: likeError } = await supabase
      .from("Like")
      .insert([{ post_id: postId, user_id: user.id }]);

    if (likeError) {
      throw new Error(`Error liking post: ${likeError.message}`);
    }

    return true; // Liked successfully
  }
}
