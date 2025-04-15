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
  coverphotoImageToCloudinary,
  deleteImageFromCloudinary,
  removeDeletedCloudinaryImages,
} from "@/utils/postHandler";

interface Post {
  id: string;
  title: string;
  coverphoto: string | null | undefined;
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
  coverphoto?: string | null | undefined; // Optional Cloudinary URL for the cover photo
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

      // Step 1: Extract existing images (Cloudinary URLs) from the content
      const { existingImages: oldImages } = extractImages(post.content);
      const { newImages, existingImages: newExistingImages } = extractImages(
        data.content
      );

      // Step 2: Delete images from Cloudinary that are removed from the content
      const imagesToDelete = oldImages.filter(
        (img) => !newExistingImages.includes(img)
      );

      for (const imageUrl of imagesToDelete) {
        console.log("Deleting content image from Cloudinary:", imageUrl);
        await deleteImageFromCloudinary(imageUrl);
      }

      let cleanedContent = removeDeletedCloudinaryImages(
        data.content,
        imagesToDelete
      );

      // Prepare basic post update payload (without images)
      const payload = {
        title: data.title,
        category_id: parseInt(data.category, 10),
        content: data.content, // Content before replacing image URLs
        published: data.published,
      };

      const response = await fetch(`/api/posts/${post?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update post details");

      console.log("Post details updated successfully");

      // Step 3: Upload new images
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

      uploadedImageUrls.forEach(({ original, cloudinaryUrl }) => {
        cleanedContent = cleanedContent.replace(original, cloudinaryUrl);
      });

      // Step 4: Handle cover photo deletion (if flagged)
      if (isDeleted && post.coverphoto && !data.coverphoto) {
        try {
          await deleteImageFromCloudinary(post.coverphoto);
        } catch (error) {
          console.error("Error deleting cover photo from Cloudinary:", error);
        }
      }

      let coverPhotoUrl = null;

      if (data.coverphoto instanceof File) {
        // Upload new cover photo file
        try {
          const base64CoverPhoto = await fileToBase64(data.coverphoto);
          coverPhotoUrl = await coverphotoImageToCloudinary(
            base64CoverPhoto,
            post
          );
        } catch (error) {
          console.error("Error uploading new cover photo:", error);
        }
      } else if (
        typeof data.coverphoto === "string" &&
        data.coverphoto === post.coverphoto
      ) {
        // Use existing cover photo URL
        coverPhotoUrl = post.coverphoto;
      }

      // Prepare final payload
      const finalPayload: FinalPayload = { content: cleanedContent };

      if (isDeleted && !data.coverphoto && post.coverphoto) {
        finalPayload.coverphoto = null; // Clear cover photo only if deleted
      } else if (coverPhotoUrl) {
        finalPayload.coverphoto = coverPhotoUrl; // Set new or existing cover photo URL
      }

      // Step 5: Update the post with images and cover photo
      const finalResponse = await fetch(`/api/posts/${post?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      if (!finalResponse.ok) {
        throw new Error("Failed to update post with Cloudinary URLs");
      }

      console.log("Post updated with images and cover photo");

      // Step 6: Redirect the user
      const getCategory = getCategoryName(Number(data.category));

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
