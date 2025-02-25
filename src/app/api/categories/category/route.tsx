import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Ensure that createClient is called within an async context
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    console.log("🔍 Category received in API:", category);

    if (!category) {
      console.error("❌ No category provided!");
      return NextResponse.json(
        { error: "Category query parameter is required" },
        { status: 400 }
      );
    }

    const capitalizeFirstLetter = (str?: string) => {
      if (!str) return "This category";

      if (str.toLowerCase() === "games+puzzles") {
        return "Games+Puzzles";
      }

      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const decodeAndFormatCategory = (category: string) => {
      const decodedCategory = decodeURIComponent(category);
      const formattedCategory = capitalizeFirstLetter(
        decodedCategory.replace(/-/g, "+")
      );
      return formattedCategory;
    };

    const searchCategory = decodeAndFormatCategory(category);

    // Fetch category data
    const { data: categoryData, error: categoryError } = await supabase
      .from("Category")
      .select("*")
      .eq("name", searchCategory)
      .single();

    if (categoryError) throw categoryError;

    console.log("📌 Found category data:", categoryData);

    if (!categoryData) {
      console.error(`❌ Category '${searchCategory}' not found!`);
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Fetch posts filtered by categoryId
    const { data: posts, error: postsError } = await supabase
      .from("Post")
      .select("*")
      .eq("category_id", categoryData.id)
      .order("created_at", { ascending: false });

    if (postsError) throw postsError;

    console.log(
      `✅ Found ${posts.length} posts for category '${searchCategory}'`
    );

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("❌ Supabase error:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}
