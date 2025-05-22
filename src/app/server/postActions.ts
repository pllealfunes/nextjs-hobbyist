"use server";

import { toast } from "react-hot-toast";
import { createClient } from "@/utils/supabase/server";
import { v2 as cloudinary } from "cloudinary";
import { extractImages } from "@/app/server/utils/postUtils";
import { extractPublicIdFromUrl } from "@/utils/postHandler";

export async function getPublishedPosts() {
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

    // Fetch published posts for the authenticated user
    const { data: posts, error } = await supabase
      .from("Post")
      .select("*")
      .eq("author_id", user.id)
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching published posts: ${error.message}`);
    }

    return posts; // Directly return the data (instead of an HTTP response)
  } catch (error) {
    console.error("Error fetching published posts:", error);
    throw new Error(
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}

export async function getDraftPosts() {
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

    // Fetch only the user's draft posts
    const { data: posts, error } = await supabase
      .from("Post")
      .select("*")
      .eq("author_id", user.id)
      .eq("published", false)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching draft posts: ${error.message}`);
    }

    return posts;
  } catch (error) {
    console.error("Error fetching draft posts:", error);
    throw new Error(
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}

export async function createPost({
  title,
  category_id,
  content,
  published,
}: {
  title: string;
  category_id: number;
  content: string;
  published: boolean;
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

    // Insert post without a cover photo
    const { data, error } = await supabase
      .from("Post")
      .insert([
        {
          title,
          category_id,
          author_id: user.id,
          coverphoto: null, // Set as null initially
          content,
          published,
        },
      ])
      .select();

    if (error) {
      throw new Error(`Error creating post: ${error.message}`);
    }

    return { success: true, post: data[0] };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

export async function updatePost(
  postId: string,
  updatedFields: Partial<{
    title: string;
    category_id: number;
    coverphoto: string | null;
    content: string;
    published: boolean;
  }>
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

    // Validate postId
    if (!postId || postId.trim() === "") {
      throw new Error("Invalid or missing postId");
    }

    // Ensure coverphoto is null if it's undefined
    if (updatedFields.coverphoto === undefined) {
      updatedFields.coverphoto = null;
    }

    // Update the post
    const { data, error } = await supabase
      .from("Post")
      .update(updatedFields)
      .eq("id", postId)
      .eq("author_id", user.id)
      .select("*");

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

export async function deletePost(postId: string) {
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
    if (!postId || postId.trim() === "") {
      throw new Error("Invalid or missing postId");
    }

    // Fetch the post to get cover photo public_id
    const { data: postData, error: fetchError } = await supabase
      .from("Post")
      .select("id, content, coverphoto")
      .eq("id", postId)
      .eq("author_id", user.id)
      .maybeSingle();

    if (fetchError) throw new Error(fetchError.message);
    if (!postData) {
      throw new Error("Post not found or not authorized");
    }

    // 🧹 Extract images from content & delete from Cloudinary
    const { existingImages: contentImages } = extractImages(postData.content);
    for (const imageUrl of contentImages) {
      const publicId = extractPublicIdFromUrl(imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // 🧹 Delete cover photo if exists
    if (postData.coverphoto) {
      const coverPublicId = extractPublicIdFromUrl(postData.coverphoto);
      if (coverPublicId) {
        await cloudinary.uploader.destroy(coverPublicId);
      }
    }

    // Delete post from Supabase
    const { data, error } = await supabase
      .from("Post")
      .delete()
      .eq("id", postId)
      .eq("author_id", user.id)
      .select("*");

    if (error) throw new Error(`Error deleting post: ${error.message}`);
    if (!data || data.length === 0) {
      throw new Error("Post not found or not authorized");
    }

    return { success: true, message: "Post deleted" };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
