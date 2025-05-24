"use server";
import { createClient } from "@/utils/supabase/server";

export async function getCommentsById(postId: string) {
  try {
    const supabase = await createClient();

    if (!postId) {
      throw new Error("Post ID is required");
    }

    // Fetch post data by ID
    const { data: comments, error } = await supabase
      .from("Comment")
      .select(
        `
        id,
        post_id,
        author_id,
        comment,
        created_at,
        updated_at,
        User:author_id (id, username),
        Profile:author_id (photo)
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Error fetching comments: ${error.message}`);
    if (!comments || comments.length === 0) {
      throw new Error("No comments found");
    }

    return { success: true, comments };
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
  comment,
}: {
  postId: string;
  comment: string;
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
          post_id: postId,
          comment: comment,
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

    const { error } = await supabase
      .from("Comment")
      .delete()
      .eq("comment_id", commentId);

    return { success: true, message: "Comment deleted" };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
