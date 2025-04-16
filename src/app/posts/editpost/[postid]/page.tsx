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
import { toast } from "react-hot-toast";

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

    await toast.promise(
      (async () => {
        console.log("Editing Post ID:", post?.id);

        const { existingImages: oldImages } = extractImages(post.content);
        const { newImages, existingImages: newExistingImages } = extractImages(
          data.content
        );

        const imagesToDelete = oldImages.filter(
          (img) => !newExistingImages.includes(img)
        );

        for (const imageUrl of imagesToDelete) {
          await deleteImageFromCloudinary(imageUrl);
        }

        let cleanedContent = removeDeletedCloudinaryImages(
          data.content,
          imagesToDelete
        );

        const payload = {
          title: data.title,
          category_id: parseInt(data.category, 10),
          content: data.content,
          published: data.published,
        };

        const response = await fetch(`/api/posts/${post?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to update post details");

        const uploadedImageUrls = await Promise.all(
          newImages.map(async (image) => {
            try {
              const cloudinaryUrl = await uploadImageToCloudinary(image, post);
              return { original: image, cloudinaryUrl };
            } catch (error) {
              console.error("Error uploading new image:", error);
              return { original: image, cloudinaryUrl: image };
            }
          })
        );

        uploadedImageUrls.forEach(({ original, cloudinaryUrl }) => {
          cleanedContent = cleanedContent.replace(original, cloudinaryUrl);
        });

        if (isDeleted && post.coverphoto && !data.coverphoto) {
          await deleteImageFromCloudinary(post.coverphoto);
        }

        let coverPhotoUrl = null;

        if (data.coverphoto instanceof File) {
          const base64CoverPhoto = await fileToBase64(data.coverphoto);
          coverPhotoUrl = await coverphotoImageToCloudinary(
            base64CoverPhoto,
            post
          );
        } else if (
          typeof data.coverphoto === "string" &&
          data.coverphoto === post.coverphoto
        ) {
          coverPhotoUrl = post.coverphoto;
        }

        const finalPayload: FinalPayload = { content: cleanedContent };

        if (isDeleted && !data.coverphoto && post.coverphoto) {
          finalPayload.coverphoto = null;
        } else if (coverPhotoUrl) {
          finalPayload.coverphoto = coverPhotoUrl;
        }

        const finalResponse = await fetch(`/api/posts/${post?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalPayload),
        });

        if (!finalResponse.ok) {
          throw new Error("Failed to update post with Cloudinary URLs");
        }

        const getCategory = getCategoryName(Number(data.category));

        router.push(
          data.published
            ? `/posts/${post?.id}/post?category=${getCategory.toLowerCase()}`
            : "/posts/drafts"
        );
      })(),
      {
        loading: "Saving changes...",
        success: "Post updated successfully!",
        error: (err) => `Something went wrong while saving: ${err.toString()}`,
      }
    );
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
