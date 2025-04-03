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
  const [isDeleted, setIsDeleted] = useState(false);

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
      // Step 2: Extract and upload images in content
      const { newImages, existingImages } = extractImages(data.content);
      let updatedContent = data.content;

      // Handle existing images
      existingImages.forEach((image) => {
        console.log("Using existing image:", image);
      });

      // Upload new images
      const uploadedImageUrls = await Promise.all(
        newImages.map(async (image) => {
          try {
            const cloudinaryUrl = await uploadImageToCloudinary(image, post);
            return { original: image, cloudinaryUrl };
          } catch (error) {
            console.error("Error uploading new image:", error);
            return { original: image, cloudinaryUrl: image }; // Fallback to original image
          }
        })
      );

      // Replace image URLs in the content
      uploadedImageUrls.forEach(({ original, cloudinaryUrl }) => {
        updatedContent = updatedContent.replace(original, cloudinaryUrl);
      });

      // Handle cover photo deletion
      if (isDeleted && post.coverphoto && data.coverphoto === undefined) {
        const public_id = post.coverphoto
          .split("/")
          .slice(-2) // Get the last two parts, folder and image name
          .join("/") // Join them to form the public ID
          .split(".")[0];
        try {
          const response = await fetch("/api/delete-coverphoto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_id }),
          });

          const data = await response.json();
          console.log("Delete coverphoto Message", data.message);
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }

      // Step 3: Upload cover photo (if provided)
      let coverPhotoUrl = null;

      if (data.coverphoto instanceof File && data.coverphoto != undefined) {
        // A new file has been uploaded via the file finder
        try {
          console.log("New cover photo detected:", data.coverphoto);
          const base64CoverPhoto = await fileToBase64(data.coverphoto);
          coverPhotoUrl = await uploadImageToCloudinary(base64CoverPhoto, post);
        } catch (error) {
          console.error("Error uploading new cover photo:", error);
        }
      } else if (
        typeof data.coverphoto === "string" &&
        data.coverphoto === post.coverphoto
      ) {
        // The existing cover photo URL is being used
        console.log("Using existing cover photo, no upload necessary.");
        coverPhotoUrl = post.coverphoto; // Retain the existing Cloudinary URL
      } else {
        console.log("No cover photo provided for upload.");
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
        <EditPostForm
          categories={categories}
          post={post}
          onSubmit={onSubmit}
          isDeleted={isDeleted}
          setIsDeleted={setIsDeleted}
        />
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
