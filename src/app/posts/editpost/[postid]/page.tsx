"use client";

import EditPostForm from "@/ui/forms/editpost-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { CreatePostSchema } from "@/app/schemas";
import { Skeleton } from "@/ui/components/skeleton";
import { Trash2 } from "lucide-react";
import {
  fileToBase64,
  uploadImageToCloudinary,
  coverphotoImageToCloudinary,
} from "@/utils/postHandler";
import { deleteImageFromCloudinary } from "@/app/server/utils/cloudinaryUtils";
import { processPostImages } from "@/app/server/processPostImages";
import { toast } from "react-hot-toast";
import { Post } from "@/lib/types";
import DeleteConfirmationDialog from "@/ui/components/deleteConfirmationDialog";
import { deletePost, updatePost } from "@/app/server/postActions";
import { getPostById } from "@/app/server/postActions";
import { useCategoriesQuery } from "@/hooks/categoriesQuery";

// Define the type for form data
type FormData = z.infer<typeof CreatePostSchema>;

export default function EditPost() {
  const { postid } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const { data: categories } = useCategoriesQuery();
  const router = useRouter();
  const [isDeleted, setIsDeleted] = useState(false);

  const safePostId = typeof postid === "string" ? postid : "";

  useEffect(() => {
    async function loadData() {
      try {
        const postResponse = await getPostById(safePostId);

        if (!postResponse.success) {
          console.error("Error fetching data:", postResponse.error);
          return;
        }
        setPost(postResponse.post);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    }

    loadData();
  }, [postid]);

  const getCategoryName = (categoryId: number): string => {
    const category = categories?.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const onDeleteSuccess = async () => {
    router.push("/dashboard");
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!post) {
      throw new Error("Post is null. Cannot proceed.");
    }

    await toast.promise(
      (async () => {
        const result = await processPostImages(
          post.id,
          post.content,
          data.content
        );

        if (!result.success) {
          toast.error(`Failed to process images: ${result.error}`);
          return;
        }

        let cleanedContent = result.cleanedContent;
        const newImages = result.newImages;

        const payload = {
          title: data.title,
          category_id: parseInt(data.category, 10),
          content: cleanedContent,
          published: data.published,
        };

        const postUpdateResult = await updatePost(post.id, payload);

        if (!postUpdateResult.success) {
          toast.error(`Failed to update post: ${postUpdateResult.error}`);
          return; // ❌ Prevent image deletion if the post update fails
        }

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

        const finalPayload: { content: string; coverphoto?: string | null } = {
          content: cleanedContent,
        };

        if (isDeleted && !data.coverphoto && post.coverphoto) {
          finalPayload.coverphoto = null;
        } else if (coverPhotoUrl) {
          finalPayload.coverphoto = coverPhotoUrl;
        }

        const finalResponse = await updatePost(post.id, finalPayload);

        if (!finalResponse.success) {
          toast.error(`Failed to update post: ${finalResponse.error}`);
          return;
        }

        await Promise.all(
          result.imagesToDelete.map(async (imageUrl) => {
            await deleteImageFromCloudinary(imageUrl);
          })
        );

        if (post.coverphoto && isDeleted && !data.coverphoto) {
          await deleteImageFromCloudinary(post.coverphoto);
        }

        // Redirect after successful edit
        const getCategory = getCategoryName(Number(data.category));
        router.push(
          data.published
            ? `/posts/${post?.id}/post?category=${encodeURIComponent(
                getCategory.toLowerCase()
              )}`
            : "/posts/drafts"
        );
      })(),
      {
        loading: "Saving changes...",
        success: data.published
          ? "Post updated successfully!"
          : "Draft saved successfully!",
        error: (err) => `Something went wrong while saving: ${err.toString()}`,
      }
    );
  };

  return (
    <div>
      {post ? (
        <main className="flex flex-col items-center w-full">
          {/* Trash icon aligned to the right */}
          <div className="mx-auto w-full md:w-4/5 lg:w-2/3 xl:w-3/5 2xl:w-1/2 flex justify-end mb-4">
            <DeleteConfirmationDialog
              trigger={
                <Trash2 className="text-red-500 cursor-pointer w-9 h-9" />
              }
              onConfirm={async () => {
                try {
                  const result = await deletePost(post.id);

                  if (!result.success) {
                    toast.error(`Failed to delete post: ${result.error}`);
                  } else {
                    toast.success("Post deleted successfully!");
                    onDeleteSuccess();
                  }
                } catch (error) {
                  toast.error(`Unexpected error: ${error}`);
                }
              }}
            />
          </div>

          {/* Centered form underneath */}
          <div className="w-full max-w-2xl">
            <EditPostForm
              post={post}
              onSubmit={onSubmit}
              isDeleted={isDeleted}
              setIsDeleted={setIsDeleted}
            />
          </div>
        </main>
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
