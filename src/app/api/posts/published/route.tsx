import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    console.log("Fetching posts...");

    // Initialize the Supabase client
    const supabase = await createClient();

    const { data: posts, error } = await supabase
      .from("Post")
      .select("*")
      .is("published", true)
      .order("created_at", { ascending: false });
    console.log(posts);

    if (error) throw error;

    console.log("Posts fetched:", posts);
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}
