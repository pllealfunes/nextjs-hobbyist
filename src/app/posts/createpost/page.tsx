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

interface Post {
  author_id: number;
  id: number;
}

// interface ImageMap {
//   original: string;
//   cloudinaryUrl: string;
// }

const extractImages = (content: string): string[] => {
  const doc = new DOMParser().parseFromString(content, "text/html");
  return Array.from(doc.querySelectorAll("img"), (img) => img.src).filter(
    Boolean
  );
};

const base64ToBlob = (base64: string): Blob => {
  const [meta, data] = base64.split(",");
  const mimeType = meta.match(/:(.*?);/)?.[1] || "";
  const byteString = atob(data);
  const arrayBuffer = new Uint8Array(byteString.length).map((_, i) =>
    byteString.charCodeAt(i)
  );
  return new Blob([arrayBuffer], { type: mimeType });
};

const uploadImageToCloudinary = async (
  image: string,
  post: Post
): Promise<string> => {
  const blob = base64ToBlob(image);
  const res = await fetch("/api/sign-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: post.author_id, postId: post.id }),
  });
  const { signature, timestamp, public_id, api_key } = await res.json();
  if (!signature) throw new Error("Signature missing");

  const formData = new FormData();
  formData.append("file", blob);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("public_id", public_id);
  formData.append("api_key", api_key);
  formData.append("eager", "w_400,h_300,c_pad|w_260,h_200,c_crop");

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  if (!uploadRes.ok) throw new Error("Image upload failed");

  return (await uploadRes.json()).secure_url;
};

// const replaceImageUrlsInContent = (
//   content: string,
//   imageMap: ImageMap[]
// ): string => {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(content, "text/html");

//   doc.querySelectorAll("img").forEach((img) => {
//     const originalSrc = img.getAttribute("src"); // Ensure correct original src
//     const replacement = imageMap.find(
//       ({ original }) => original === originalSrc
//     )?.cloudinaryUrl;

//     if (replacement) {
//       console.log(`Replacing: ${replacement}`);
//       img.setAttribute("src", replacement);
//     }
//   });

//   return doc.body.innerHTML; // Ensure correct content return
// };

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

    try {
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

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create post");

      const post = await response.json();

      // Step 1: Extract and upload images from the content
      const images = extractImages(data.content);
      console.log(images);

      let updatedContent = data.content;
      for (const image of images) {
        const cloudinaryUrl = await uploadImageToCloudinary(image, post);
        updatedContent = updatedContent.replace(image, cloudinaryUrl);
      }
      console.log("Final", updatedContent);

      // Update the post with the new content containing Cloudinary URLs
      await fetch(`/api/posts`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
          content: updatedContent,
        }),
      });

      console.log("Post updated with images");

      // Step 2: If a cover photo file exists, upload it
      if (data.coverphoto) {
        const res = await fetch("/api/sign-coverphoto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: post.author_id, postId: post.id }),
        });
        const { signature, timestamp, public_id, api_key } = await res.json();

        if (!signature || !timestamp) throw new Error("Signature missing");

        // Prepare FormData
        const formData = new FormData();
        formData.append("file", data.coverphoto);
        formData.append("signature", signature);
        formData.append("timestamp", timestamp);
        formData.append("public_id", public_id);
        formData.append("api_key", api_key);
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
      router.push(
        data.published
          ? `/posts/${post.id}/post?category=${getCategoryName(
              Number(data.category)
            ).toLowerCase()}`
          : "/posts/drafts"
      );
    } catch (error) {
      console.error("Error handling post submission:", error);
    }
  };

  return (
    <div>
      <CreatePostForm categories={categories} onSubmit={onSubmit} />
    </div>
  );
}
