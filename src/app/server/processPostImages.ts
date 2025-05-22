"use server";
import {
  extractImages,
  removeDeletedCloudinaryImages,
} from "@/app/server/utils/postUtils";

export async function processPostImages(
  postId: string,
  originalContent: string,
  updatedContent: string
) {
  try {
    const { existingImages: oldImages } = extractImages(originalContent);
    const { newImages = [], existingImages: newExistingImages = [] } =
      extractImages(updatedContent);

    const imagesToDelete = oldImages.filter(
      (img) => !newExistingImages.includes(img)
    );

    console.log("Images flagged for deletion:", imagesToDelete);

    const cleanedContent =
      removeDeletedCloudinaryImages(updatedContent, imagesToDelete) ||
      updatedContent;

    return { success: true, cleanedContent, newImages, imagesToDelete };
  } catch (error) {
    console.error("Error processing post images:", error);
    return {
      success: false,
      cleanedContent: updatedContent,
      newImages: [],
      imagesToDelete: [],
      error: error instanceof Error ? error.message : "Internal server error", // ✅ Ensure error property exists
    };
  }
}
