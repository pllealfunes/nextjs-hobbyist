"use server";
import { createClient } from "@/utils/supabase/server";

export async function getCommentsById(postId: string) {
  try {
    const supabase = await createClient();

    if (!postId) {
      throw new Error("Post ID is required");
    }

    const { data: comments, error: commentError } = await supabase
      .from("Comment")
      .select("id, post_id, author_id, content, created_at, updated_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (commentError)
      throw new Error(`Error fetching comments: ${commentError.message}`);

    // Fetch user and profile data separately
    const authorIds = comments.map((c) => c.author_id).filter(Boolean);

    const { data: users = [], error: userError } = await supabase
      .from("User")
      .select("id, username")
      .in("id", authorIds); // Ensure it is a proper array

    if (!users || users.length === 0) {
      throw new Error("No users found");
    }

    const { data: profiles = [], error: profileError } = await supabase
      .from("Profile")
      .select("id, photo")
      .in("id", authorIds);

    if (!profiles || profiles.length === 0) {
      throw new Error("No comments found");
    }

    // Merge data manually
    const enrichedComments = comments.map((comment) => {
      return {
        ...comment,
        user: users.find((u) => u.id === comment.author_id) || {
          id: comment.author_id,
          username: "Unknown User",
        },
        profile: profiles.find((p) => p.id === comment.author_id) || {
          id: comment.author_id,
          photo: null,
        },
      };
    });

    return { success: true, comments: enrichedComments };
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

export async function createComment({
  postId,
  content,
}: {
  postId: string;
  content: string;
}) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Create Comment
    const { data, error } = await supabase
      .from("Comment")
      .insert([
        {
          content: content,
          post_id: postId,
          author_id: user.id,
        },
      ])
      .select();

    if (error) {
      throw new Error(`Error creating comment: ${error.message}`);
    }

    return { success: true, comment: data[0] };
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

export async function updateComment(
  postId: string,
  commentId: string,
  comment: string
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Validate post_id
    if (!postId || postId.trim() === "") {
      throw new Error("Invalid or missing postId");
    }

    // Update the comment
    const { data, error } = await supabase
      .from("Comment")
      .update({ comment })
      .eq("id", commentId)
      .eq("post_id", postId)
      .eq("author_id", user.id)
      .select();

    if (error) {
      throw new Error(`Error updating post: ${error.message}`);
    }
    if (!data || data.length === 0) {
      throw new Error("No post found to update");
    }

    return { success: true, post: data[0] };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

export async function deleteComment(commentId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Validate postId
    if (!commentId || commentId.trim() === "") {
      throw new Error("Invalid or missing postId");
    }

    // Delete comment from supabase

    const { error: commentError } = await supabase
      .from("Comment")
      .delete()
      .eq("comment_id", commentId);

    if (commentError) {
      throw new Error("Error deleting comment:", commentError);
    }

    return { success: true, message: "Comment deleted" };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
