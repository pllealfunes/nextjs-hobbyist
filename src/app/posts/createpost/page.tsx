"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreatePostForm from "@/ui/forms/createpost-form";
import { SubmitHandler } from "react-hook-form";
import { CreatePostSchema } from "@/app/schemas";
import { z } from "zod";

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

  // Define the type for 'data'
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);

    // Construct payload with strict typing
    const payload: {
      title: string;
      category_id: number;
      content: string;
      coverPhoto?: string; // Explicitly typed as optional
    } = {
      title: data.title,
      category_id: parseInt(data.category),
      content: data.content,
    };

    // Only include coverPhoto if it's not empty or null
    if (data.coverPhoto && data.coverPhoto.trim() !== "") {
      payload.coverPhoto = data.coverPhoto;
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const post = await response.json();
        console.log("Post created successfully", post);
        router.push(`/posts/${post.id}`);
      } else {
        console.error("Error creating post");
      }
    } catch (error) {
      console.error("Error creating post", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-5">
      <CreatePostForm categories={categories} onSubmit={onSubmit} />
    </div>
  );
}
