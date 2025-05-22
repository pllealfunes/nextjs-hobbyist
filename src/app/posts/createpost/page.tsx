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
  fileToBase64,
  uploadImageToCloudinary,
  coverphotoImageToCloudinary,
  replaceBase64WithCloudinaryUrls,
} from "@/utils/postHandler";
import { extractImages } from "@/app/server/utils/postUtils";
import { toast } from "react-hot-toast";
import { createPost, updatePost } from "@/app/server/postActions";

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
        const formData = {
          title: data.title,
          category_id: parseInt(data.category, 10),
          content: data.content,
          published: data.published,
        };

        const post = await createPost(formData);

        if (!post.success) {
          toast.error(`Failed to create post: ${post.error}`);
          return;
        }

        // STEP 2 — Upload content images to Cloudinary
        const { newImages } = extractImages(data.content);
        const uploadedImageUrls = await Promise.all(
          newImages.map(async (base64) => ({
            original: base64,
            cloudinaryUrl: await uploadImageToCloudinary(base64, post.post),
          }))
        );

        // STEP 3 — Replace base64 images in content
        const updatedContent = replaceBase64WithCloudinaryUrls(
          data.content,
          uploadedImageUrls
        );

        // STEP 4 — Update the post with new Cloudinary image URLs
        const updateContentResult = await updatePost(post.post.id, {
          content: updatedContent,
        });

        if (!updateContentResult.success) {
          toast.error(
            `Failed to update post content: ${updateContentResult.error}`
          );
          return;
        }

        // STEP 5 — Upload cover photo (if file exists)
        if (data.coverphoto instanceof File) {
          const base64 = await fileToBase64(data.coverphoto);
          const coverPhotoUrl = await coverphotoImageToCloudinary(
            base64,
            post.post
          );

          const result = await updatePost(post.post.id, {
            coverphoto: coverPhotoUrl,
          });

          if (!result.success) {
            toast.error(`Failed to update post: ${result.error}`);
            return;
          }
        }

        // STEP 6 — Redirect
        const categoryName = getCategoryName(Number(data.category));
        router.push(
          data.published
            ? `/posts/${
                post.post.id
              }/post?category=${categoryName.toLowerCase()}`
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
