"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreatePostForm from "@/ui/forms/createpost-form";
import { SubmitHandler } from "react-hook-form";
import { CreatePostSchema } from "@/app/schemas";
import { z } from "zod";
import crypto from "crypto";

// Define the type for form data
type FormData = z.infer<typeof CreatePostSchema>;

type Category = {
  id: number;
  name: string;
};

export default function CreatePost() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);

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
  }, []);

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Form Data:", data);

    // Step 1: Create the post without the cover photo
    const payload: {
      title: string;
      category_id: number;
      content: string;
      published: boolean;
    } = {
      title: data.title,
      category_id: parseInt(data.category, 10),
      content: data.content,
      published: data.published,
    };

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create post");

      const post = await response.json();
      console.log("Post created:", post);

      // Step 2: If a cover photo file exists, upload it
      if (data.coverphoto) {
        const res = await fetch("/api/sign-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: post.author_id, postId: post.id }),
        });
        const { signature, timestamp, api_key } = await res.json();

        if (!signature || !timestamp) throw new Error("Signature missing");

        // Create a hashed user ID
        const userId = post.author_id;
        const hashedUserId = crypto
          .createHash("sha256")
          .update(userId)
          .digest("hex");

        // Use the hashed ID in your public_id
        const public_id = `cover_photos/${hashedUserId}_${post.id}`;

        // Prepare FormData
        const formData = new FormData();
        formData.append("file", data.coverphoto);
        formData.append("api_key", api_key);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("public_id", public_id);
        formData.append("eager", "w_400,h_300,c_pad|w_260,h_200,c_crop");
        // Upload to Cloudinary
        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) throw new Error("Failed to upload cover photo");

        const uploadResult = await uploadResponse.json();

        // Step 3: Update the post with the Cloudinary URL
        await fetch(`/api/posts`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId: post.id,
            coverphoto: uploadResult.secure_url,
          }),
        });

        console.log("Post updated with cover photo");
      }

      // Step 4: Redirect the user
      const category = getCategoryName(
        parseInt(data.category, 10)
      ).toLowerCase();
      router.push(`/posts/${post.id}/post?category=${category}`);
    } catch (error) {
      console.error("Error handling post submission:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-5">
      <CreatePostForm categories={categories} onSubmit={onSubmit} />
    </div>
  );
}
