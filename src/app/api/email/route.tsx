import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(req: Request) {
  try {
    // Extract new user details from the request body
    const updatedFields = await req.json(); // Parse the request body (JSON payload)

    const supabase = await createClient();
    const {
      data: { user },
      error: authUserError,
    } = await supabase.auth.getUser();

    if (authUserError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate input
    if (
      !user.id ||
      !updatedFields.email.trim() ||
      updatedFields.email.trim() === ""
    ) {
      return NextResponse.json(
        {
          error: "Invalid input data. Ensure new email are provided.",
        },
        { status: 400 }
      );
    }

    // **Step 1: Update `auth.users` in Supabase**
    const { error: authError } = await supabase.auth.updateUser({
      email: updatedFields.email.trim(),
    });

    if (authError) {
      console.error("Error updating auth.users:", authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // **Step 2: Update `users` table**
    const { error: userError } = await supabase
      .from("User")
      .update(updatedFields)
      .eq("id", user.id);

    if (userError) {
      console.error("Error updating users table:", userError);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Email updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API route /api/user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
