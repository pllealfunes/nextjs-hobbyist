import { NextResponse } from "next/server";
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
      .from("User")
      .select("id, name, username, email")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user from Supabase:", error);
      return NextResponse.json(
        { error: "Error fetching user" },
        { status: 500 }
      );
    }

    return NextResponse.json(userInfo, { status: 200 });
  } catch (error) {
    console.error("Error in API route /api/user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
