import { Post, UserProfile } from "@/lib/types";

type ExtractedImages = {
  newImages: string[]; // Base64 or temporary URLs
  existingImages: string[]; // Cloudinary URLs
};

export const extractImages = (content: string): ExtractedImages => {
  const imageRegex = /<img[^>]*src="([^"]+)"[^>]*>/g; // Regex to extract image `src`
  const cloudinaryUrlPrefix = "https://res.cloudinary.com"; // Cloudinary URL prefix

  const newImages: string[] = [];
  const existingImages: string[] = [];

  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    const imageUrl = match[1]; // Extract the `src` attribute value

    if (imageUrl.startsWith(cloudinaryUrlPrefix)) {
      existingImages.push(imageUrl); // Categorize as existing Cloudinary image
    } else {
      newImages.push(imageUrl); // Categorize as a new image (base64 or temporary URL)
    }
  }

  return { newImages, existingImages };
};

export const base64ToBlob = (base64: string): Blob => {
  if (!base64 || !base64.includes(",")) {
    throw new Error(
      "Invalid base64 string. Ensure it contains metadata and data."
    );
  }

  const [meta, data] = base64.split(",");
  if (!meta || !data) {
    throw new Error(
      "Malformed base64 string. Missing metadata or encoded content."
    );
  }

  const mimeType = meta.match(/:(.*?);/)?.[1] || "";
  if (!mimeType) {
    throw new Error("Unable to determine MIME type from metadata.");
  }

  let byteString;
  try {
    byteString = atob(data);
  } catch (error) {
    throw new Error(`Invalid base64 data. Could not decode.${error}`);
  }

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
    `
https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload
`,

    {
      method: "POST",
      body: formData,
    }
  );
  if (!uploadRes.ok) throw new Error("Image upload failed");

  return (await uploadRes.json()).secure_url;
};

export const coverphotoImageToCloudinary = async (
  image: string,
  post: Post
): Promise<string> => {
  const res = await fetch("/api/sign-coverphoto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: post.author_id, postId: post.id }),
  });
  const { signature, timestamp, public_id, api_key } = await res.json();
  if (!signature) throw new Error("Signature missing");

  const formData = new FormData();
  formData.append("file", image);
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

export const removeDeletedCloudinaryImages = (
  content: string,
  imagesToDelete: string[]
): string => {
  let cleanedContent = content;

  for (const imageUrl of imagesToDelete) {
    const escapedUrl = imageUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`<img[^>]*src="${escapedUrl}"[^>]*>`, "g");
    cleanedContent = cleanedContent.replace(regex, "");
  }

  return cleanedContent;
};

export const replaceBase64WithCloudinaryUrls = (
  html: string,
  uploadedImageUrls: { original: string; cloudinaryUrl: string }[]
) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const imgs = doc.querySelectorAll("img");

  imgs.forEach((img) => {
    const src = img.getAttribute("src");
    const match = uploadedImageUrls.find((u) => u.original === src);
    if (match) img.setAttribute("src", match.cloudinaryUrl);
  });

  return doc.body.innerHTML;
};

export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const parts = new URL(url).pathname.split("/");
    const versionIndex = parts.findIndex((part) => part.startsWith("v"));
    const publicIdParts = parts.slice(versionIndex + 1); // after version
    const filename = publicIdParts.pop()!;
    const publicId = [...publicIdParts, filename.split(".")[0]].join("/");
    return publicId;
  } catch {
    return null;
  }
};

// Deletes image from Cloudinary via your API route
export const deleteImageFromCloudinary = async (
  imageUrl: string
): Promise<{ success: boolean; error?: string }> => {
  const public_id = extractPublicIdFromUrl(imageUrl);

  if (!public_id) {
    console.warn("Could not extract public_id from image URL:", imageUrl);
    return { success: false, error: "Invalid image URL" };
  }

  try {
    const response = await fetch("/api/delete-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_id }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const avatarToCloudinary = async (
  image: string,
  user: UserProfile
): Promise<string> => {
  const blob = base64ToBlob(image);
  const res = await fetch("/api/sign-avatar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id }),
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
    `
https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload
`,

    {
      method: "POST",
      body: formData,
    }
  );

  if (!uploadRes.ok) {
    const errorData = await uploadRes.json();
    throw new Error(
      `Cloudinary upload failed: ${errorData.error.message || "Unknown error"}`
    );
  }

  return (await uploadRes.json()).secure_url;
};
