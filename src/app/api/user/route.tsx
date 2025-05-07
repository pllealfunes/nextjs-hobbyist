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

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();

    // Extract new user details from the request body
    const updatedFields = await req.json(); // Parse the request body (JSON payload)

    // Validate input
    if (
      !updatedFields.id ||
      !updatedFields.name ||
      !updatedFields.username ||
      updatedFields.name.trim() === "" ||
      updatedFields.username.trim() === ""
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid input data. Ensure userId, newName, and newUsername are provided.",
        },
        { status: 400 }
      );
    }

    // **Step 1: Update `auth.users` in Supabase**
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        name: updatedFields.name.trim(),
        username: updatedFields.username.trim(),
      }, // Update metadata
    });

    if (authError) {
      console.error("Error updating auth.users:", authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // **Step 2: Update `users` table**
    const { error: userError } = await supabase
      .from("User")
      .update(updatedFields)
      .eq("id", updatedFields.id);

    if (userError) {
      console.error("Error updating users table:", userError);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
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
