"use server";
import { v2 as cloudinary } from "cloudinary";
import { extractPublicIdFromUrl } from "@/utils/postHandler";

export async function deleteImageFromCloudinary(
  imageUrl: string
): Promise<{ success: boolean; error?: string }> {
  const public_id = extractPublicIdFromUrl(imageUrl);

  if (!public_id) {
    console.warn("Could not extract public_id from image URL:", imageUrl);
    return { success: false, error: "Invalid image URL" };
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log("Cloudinary delete result:", result); // ✅ Debug check

    if (result.result !== "ok") {
      throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
