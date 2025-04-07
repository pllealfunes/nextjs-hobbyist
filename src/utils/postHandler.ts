import { Post } from "@/lib/types";

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

const uploadedImageCache = new Set<string>();
export const uploadImageToCloudinary = async (
  image: string,
  post: Post
): Promise<string> => {
  if (uploadedImageCache.has(image)) {
    console.log("Image already uploaded, skipping:", image);
    return image; // Return the previously uploaded image URL
  }

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

export const deleteImageFromCloudinary = async (imageUrl: string) => {
  // Extract the public_id from the Cloudinary URL
  const public_id = imageUrl
    .split("/")
    .slice(-2) // Get the last two parts, folder and image name
    .join("/") // Join them to form the public ID
    .split(".")[0]; // Remove file extension

  try {
    const response = await fetch(`/api/delete-coverphoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_id }),
    });

    const data = await response.json();
    if (data.error) {
      console.error("Error deleting image from Cloudinary:", data.error);
    } else {
      console.log("Image deleted from Cloudinary:", data);
    }
  } catch (error) {
    console.error("Error calling delete image API:", error);
  }
};

export const removeCloudinaryUrls = (content: string): string => {
  const cloudinaryUrlPrefix = "https://res.cloudinary.com"; // Cloudinary URL prefix
  const imageRegex = /<img[^>]*src="([^"]+)"[^>]*>/g;

  // Replace the image URLs that start with the Cloudinary prefix with an empty string
  return content.replace(imageRegex, (match, imageUrl) => {
    if (imageUrl.startsWith(cloudinaryUrlPrefix)) {
      return ""; // Remove Cloudinary image
    }
    return match; // Keep non-Cloudinary images
  });
};

// export const handlePost = async (
//   formData: FormData, // FormData to handle both text and files
//   post: Post | null, // Pass null for creating a post, or an existing post for editing
//   isEdit: boolean,
//   router: any,
//   getCategoryName: (id: number) => string
// ) => {
//   try {
//     const url = isEdit ? `/api/posts/${post?.id}` : "/api/posts";
//     console.log("API URL:", url);

//     const method = isEdit ? "PUT" : "POST";

//     // Send request with FormData
//     const response = await fetch(url, {
//       method,
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(
//         isEdit ? "Failed to update post" : "Failed to create post"
//       );
//     }

//     const currentPost = isEdit ? post : await response.json();

//     // Redirect the user
//     router.push(
//       formData.get("published") === "true"
//         ? `/posts/${currentPost.id}/post?category=${getCategoryName(
//             Number(formData.get("category"))
//           ).toLowerCase()}`
//         : "/posts/drafts"
//     );
//   } catch (error) {
//     console.error("Error handling post:", error);
//   }
// };
