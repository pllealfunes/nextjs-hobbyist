import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function GET() {
  try {
    console.log("Fetching categories...");

    const { data: categories, error } = await supabase
      .from("Category")
      .select("*");

    if (error) throw error;

    console.log("Categories fetched:", categories);

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories", details: error },
      { status: 500 }
    );
  }
}
