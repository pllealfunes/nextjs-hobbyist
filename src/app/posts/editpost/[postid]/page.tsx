"use client";

import EditPostForm from "@/ui/forms/editpost-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { CreatePostSchema } from "@/app/schemas";
import { Skeleton } from "@/ui/components/skeleton";
import {
  extractImages,
  fileToBase64,
  uploadImageToCloudinary,
} from "@/utils/postHandler";

interface Post {
  id: string;
  title: string;
  coverphoto: string;
  content: string;
  category_id: number;
  published: boolean;
  private: boolean;
  author_id: string;
  created_at: Date;
  updated_at: Date;
}

interface FinalPayload {
  content: string; // The updated content of the post
  coverphoto?: string; // Optional Cloudinary URL for the cover photo
}

// Define the type for the 'html' parameter
// function extractTextFromHTML(html: string): string {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(html, "text/html");
//   return doc.body.textContent?.trim() || "";
// }

// Define the type for form data
type FormData = z.infer<typeof CreatePostSchema>;

type Category = {
  id: number;
  name: string;
};

export default function EditPost() {
  const { postid } = useParams();
  //const searchParams = useSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadCategories() {
      try {
        const resCategories = await fetch("/api/categories");
        const categoriesFecthed = await resCategories.json();

        const resPost = await fetch(`/api/posts/post?id=${postid}`);
        const postFetched = await resPost.json();

        setCategories(categoriesFecthed);
        setPost(postFetched);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    }

    loadCategories();
  }, [postid]);

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  // Define the type for 'data'
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!post) {
      throw new Error("Post is null. Cannot proceed.");
    }

    try {
      console.log("Editing Post ID:", post?.id);

      // Step 1: Update basic post details without images
      const payload = {
        title: data.title,
        category_id: parseInt(data.category, 10),
        content: data.content, // Temporary content without Cloudinary URLs
        published: data.published,
      };

      const response = await fetch(`/api/posts/${post?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update post details");

      console.log("Post details updated successfully");

      // Step 2: Extract and upload images in content
      const images = extractImages(data.content); // Extract base64 or temporary URLs
      let updatedContent = data.content;

      const uploadedImageUrls = await Promise.all(
        images.map(async (image) => {
          const cloudinaryUrl = await uploadImageToCloudinary(image, post);
          return { original: image, cloudinaryUrl };
        })
      );

      // Replace image URLs in the content
      uploadedImageUrls.forEach(({ original, cloudinaryUrl }) => {
        updatedContent = updatedContent.replace(original, cloudinaryUrl);
      });

      // Step 3: Upload cover photo (if provided)
      let coverPhotoUrl = null;
      if (data.coverphoto) {
        const base64CoverPhoto = await fileToBase64(data.coverphoto);
        coverPhotoUrl = await uploadImageToCloudinary(base64CoverPhoto, post);
      }

      // Step 4: Update the post with Cloudinary URLs
      const finalPayload: FinalPayload = { content: updatedContent };
      if (coverPhotoUrl) finalPayload.coverphoto = coverPhotoUrl; // Include cover photo if it exists

      const finalResponse = await fetch(`/api/posts/${post?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      if (!finalResponse.ok)
        throw new Error("Failed to update post with Cloudinary URLs");

      console.log("Post updated with images and cover photo");

      const getCategory = getCategoryName(Number(data.category));

      // Step 5: Redirect the user
      router.push(
        data.published
          ? `/posts/${post?.id}/post?category=${getCategory.toLowerCase()}`
          : "/posts/drafts"
      );
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  return (
    <div>
      {post ? (
        <EditPostForm categories={categories} post={post} onSubmit={onSubmit} />
      ) : (
        <div className="max-w-3xl mx-auto py-5 space-y-4">
          {/* Skeleton for title input */}
          <Skeleton className="h-12 w-full rounded-md" />

          {/* Skeleton for category input */}
          <Skeleton className="h-12 w-full rounded-md" />

          {/* Skeleton for coverphoto input */}
          <Skeleton className="h-12 w-32 rounded-md" />

          {/* Skeleton for content input */}
          <Skeleton className="h-64 w-full rounded-md" />

          {/* Skeleton for submit button */}
          <Skeleton className="h-12 w-32 rounded-md" />
        </div>
      )}
    </div>
  );
}
