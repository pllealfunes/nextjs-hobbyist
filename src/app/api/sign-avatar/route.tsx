import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { userId, postId } = await request.json();

    // Cloudinary Signature
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Create a hashed user ID
    const hashedUserId = crypto
      .createHash("sha256")
      .update(userId)
      .digest("hex");

    // Use the hashed ID in your public_id
    const public_id = `avatar_photos/${hashedUserId}_${timestamp}`;

    const paramsToSign = {
      timestamp,
      eager: "w_400,h_300,c_pad|w_260,h_200,c_crop",
      public_id,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    return new Response(
      JSON.stringify({
        signature,
        timestamp,
        public_id,
        api_key: process.env.CLOUDINARY_API_KEY,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }
}
