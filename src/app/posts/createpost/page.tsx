"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreatePostForm from "@/ui/forms/createpost-form";
import { SubmitHandler } from "react-hook-form";
import { CreatePostSchema } from "@/app/schemas";
import { z } from "zod";
import { Skeleton } from "@/ui/components/skeleton";
import { Category } from "@/lib/types";
import {
  extractImages,
  fileToBase64,
  uploadImageToCloudinary,
  coverphotoImageToCloudinary,
  replaceBase64WithCloudinaryUrls,
} from "@/utils/postHandler";
import { toast } from "react-hot-toast";

// Define the type for form data
type FormData = z.infer<typeof CreatePostSchema>;

export default function CreatePost() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    }

    loadCategories();
    setLoading(false);
  }, []);

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await toast.promise(
      (async () => {
        // STEP 1 — Create the post (no images yet)
        const createRes = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title,
            category_id: parseInt(data.category, 10),
            content: data.content,
            published: data.published,
          }),
        });

        if (!createRes.ok) throw new Error("Failed to create post");
        const post = await createRes.json();

        // STEP 2 — Upload content images to Cloudinary
        const { newImages } = extractImages(data.content);
        const uploadedImageUrls = await Promise.all(
          newImages.map(async (base64) => ({
            original: base64,
            cloudinaryUrl: await uploadImageToCloudinary(base64, post),
          }))
        );

        // STEP 3 — Replace base64 images in content
        const updatedContent = replaceBase64WithCloudinaryUrls(
          data.content,
          uploadedImageUrls
        );

        // STEP 4 — Update post with Cloudinary image URLs
        const updateContentRes = await fetch(`/api/posts/${post.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: updatedContent }),
        });

        if (!updateContentRes.ok) throw new Error("Failed to update content");

        // STEP 5 — Upload cover photo (if file exists)
        if (data.coverphoto instanceof File) {
          const base64 = await fileToBase64(data.coverphoto);
          const coverPhotoUrl = await coverphotoImageToCloudinary(base64, post);

          const updateCoverRes = await fetch(`/api/posts/${post.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ coverphoto: coverPhotoUrl }),
          });

          if (!updateCoverRes.ok)
            throw new Error("Failed to update cover photo");
        }

        // STEP 6 — Redirect
        const categoryName = getCategoryName(Number(data.category));
        router.push(
          data.published
            ? `/posts/${post.id}/post?category=${categoryName.toLowerCase()}`
            : "/posts/drafts"
        );
      })(),
      {
        loading: "Creating post...",
        success: data.published
          ? "Post created successfully!"
          : "Draft saved successfully!",
        error: (err) =>
          `Something went wrong while creating the post: ${err.toString()}`,
      }
    );
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div>
      <CreatePostForm categories={categories} onSubmit={onSubmit} />
    </div>
  );
}
