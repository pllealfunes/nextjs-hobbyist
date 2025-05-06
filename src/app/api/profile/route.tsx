import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch only the user's published posts
    const { data: userInfo, error } = await supabase
      .from("Profile")
      .select("bio, photo, links")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching published posts from Supabase:", error);
      return NextResponse.json(
        { error: "Error fetching published posts" },
        { status: 500 }
      );
    }

    return NextResponse.json(userInfo, { status: 200 });
  } catch (error) {
    console.error("Error in API route /api/posts/published:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updatedFields = await req.json();

    // Normalize fields: explicitly nullify removed fields
    if (updatedFields.photo === undefined) {
      updatedFields.photo = null;
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update the post/user/profile with the avatar photo URL
    const { data, error } = await supabase
      .from("Profile")
      .update(updatedFields)
      .eq("id", user.id)
      .select("*");

    if (error) throw new Error(error.message);
    if (!data || data.length === 0)
      throw new Error("No profile found to update");

    return NextResponse.json(data[0], { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
