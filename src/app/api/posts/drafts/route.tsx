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

    // Fetch only the user's draft posts
    const { data: posts, error } = await supabase
      .from("Post")
      .select("*")
      .eq("author_id", user.id)
      .eq("published", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching draft posts from Supabase:", error);
      return NextResponse.json(
        { error: "Error fetching draft posts" },
        { status: 500 }
      );
    }

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching draft posts:", error);
    return NextResponse.json(
      { error: "Error fetching draft posts" },
      { status: 500 }
    );
  }
}
