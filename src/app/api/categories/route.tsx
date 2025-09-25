import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    console.log("Fetching categories...");

    // Move the client creation inside the GET function
    const supabase = await createClient();

    const { data: categories, error } = await supabase
      .from("Category")
      .select("*");

    if (error) throw error;

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.log(error);

    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}
