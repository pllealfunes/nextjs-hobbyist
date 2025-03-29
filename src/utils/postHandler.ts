import { Post } from "@/lib/types";

export const extractImages = (content: string): string[] => {
  const doc = new DOMParser().parseFromString(content, "text/html");
  return Array.from(doc.querySelectorAll("img"), (img) => img.src).filter(
    Boolean
  );
};

export const base64ToBlob = (base64: string): Blob => {
  const [meta, data] = base64.split(",");
  const mimeType = meta.match(/:(.*?);/)?.[1] || "";
  const byteString = atob(data);
  const arrayBuffer = new Uint8Array(byteString.length).map((_, i) =>
    byteString.charCodeAt(i)
  );
  return new Blob([arrayBuffer], { type: mimeType });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const uploadImageToCloudinary = async (
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

export const handlePost = async (
  formData: FormData, // FormData to handle both text and files
  post: Post | null, // Pass null for creating a post, or an existing post for editing
  isEdit: boolean,
  router: any,
  getCategoryName: (id: number) => string
) => {
  try {
    const url = isEdit ? `/api/posts/${post?.id}` : "/api/posts";
    console.log("API URL:", url);

    const method = isEdit ? "PUT" : "POST";

    // Send request with FormData
    const response = await fetch(url, {
      method,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        isEdit ? "Failed to update post" : "Failed to create post"
      );
    }

    const currentPost = isEdit ? post : await response.json();

    // Redirect the user
    router.push(
      formData.get("published") === "true"
        ? `/posts/${currentPost.id}/post?category=${getCategoryName(
            Number(formData.get("category"))
          ).toLowerCase()}`
        : "/posts/drafts"
    );
  } catch (error) {
    console.error("Error handling post:", error);
  }
};
