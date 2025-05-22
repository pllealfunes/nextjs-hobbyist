"use server";
import { createClient } from "@/utils/supabase/server";
import { deleteImageFromCloudinary } from "@/app/server/utils/cloudinaryUtils";

export async function changeEmail(newEmail: string) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authUserError,
    } = await supabase.auth.getUser();

    if (authUserError || !user) {
      throw new Error("Unauthorized");
    }

    // Validate input
    if (!newEmail.trim() || newEmail.trim() === "") {
      throw new Error("Invalid email. Please provide a valid email.");
    }

    // **Step 1: Update email in Supabase Auth**
    const { error: authError } = await supabase.auth.updateUser({
      email: newEmail.trim(),
    });
    if (authError) {
      throw new Error(`Error updating email in auth: ${authError.message}`);
    }

    // **Step 2: Update email in `users` table**
    const { error: userError } = await supabase
      .from("User")
      .update({ email: newEmail.trim() })
      .eq("id", user.id);

    if (userError) {
      throw new Error(
        `Error updating email in users table: ${userError.message}`
      );
    }

    return { success: true, message: "Email updated successfully" };
  } catch (error) {
    console.error("Error in changeEmail server action:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  passConfirmation: string
) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const { data, error: authUserError } = await supabase.auth.getUser();
    const user = data?.user;

    if (authUserError || !user || !user.email) {
      throw new Error("Unauthorized");
    }

    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      throw new Error("Current password is incorrect.");
    }

    // Ensure new password & confirmation match
    if (newPassword !== passConfirmation) {
      throw new Error("New passwords do not match.");
    }

    // Update password securely
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw new Error("Failed to update password.");
    }

    // Force logout for security
    await supabase.auth.signOut();

    return {
      success: true,
      message: "Password updated successfully. Please log in again.",
    };
  } catch (error) {
    console.error("Password update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
}

export async function updateProfileDetails(updatedFields: {
  name?: string;
  username?: string;
  bio?: string;
  links?: { label: string; url: string }[];
}) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Ensure at least one field is being updated
    if (
      !updatedFields.name?.trim() &&
      !updatedFields.username?.trim() &&
      !updatedFields.bio?.trim() &&
      (!updatedFields.links || updatedFields.links.length === 0)
    ) {
      throw new Error("No valid updates provided.");
    }

    // **Step 1: Update Profile Table**
    const { error: profileError } = await supabase
      .from("Profile")
      .update({
        bio: updatedFields.bio,
        links: updatedFields.links,
      })
      .eq("id", user.id);

    if (profileError) {
      throw new Error(`Failed to update profile: ${profileError.message}`);
    }

    // **Step 2: Update User Table**
    const { error: userError } = await supabase
      .from("User")
      .update({
        name: updatedFields.name,
        username: updatedFields.username,
      })
      .eq("id", user.id);

    if (userError) {
      throw new Error(`Failed to update user details: ${userError.message}`);
    }

    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
}

export async function updateAvatarPhoto(photoUrl: string | null) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Update the profile with the new avatar URL
    const { error } = await supabase
      .from("Profile")
      .update({ photo: photoUrl })
      .eq("id", user.id);

    if (error) {
      throw new Error(`Failed to update avatar: ${error.message}`);
    }

    return {
      success: true,
      photo: photoUrl,
      message: "Avatar updated successfully!",
    };
  } catch (error) {
    console.error("Avatar update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
}

export async function deleteAvatarPhoto() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Get user's current avatar
    const { data: profile, error: fetchError } = await supabase
      .from("Profile")
      .select("photo")
      .eq("id", user.id)
      .maybeSingle();

    if (fetchError) throw new Error(fetchError.message);
    if (!profile || !profile.photo) {
      throw new Error("No avatar to delete.");
    }

    // Step 1️⃣: Delete the avatar from Cloudinary
    await deleteImageFromCloudinary(profile.photo);

    // Step 2️⃣: Remove avatar reference in Supabase
    const { error: updateError } = await supabase
      .from("Profile")
      .update({ photo: null })
      .eq("id", user.id);

    if (updateError)
      throw new Error(`Failed to update profile: ${updateError.message}`);

    return { success: true, message: "Avatar deleted successfully!" };
  } catch (error) {
    console.error("Error deleting avatar:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
}
