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
