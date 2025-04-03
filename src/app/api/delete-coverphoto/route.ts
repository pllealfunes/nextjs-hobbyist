import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { public_id } = await req.json(); // Extract the public_id from the request body
    console.log("Public ID:", public_id);

    if (!public_id) {
      throw new Error("Missing public_id for deletion");
    }

    // Perform Cloudinary deletion
    const result = await cloudinary.uploader.destroy(public_id);
    console.log("Cloudinary delete result:", result);

    if (result.result !== "ok") {
      console.log(`Failed to delete image: ${result.result}`);

      throw new Error(`Failed to delete image: ${result.result}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
