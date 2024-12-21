"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export async function handleLogout() {
  // Initialize Supabase client
  const supabase = await createClient();
  // Log out the user
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error.message);
    return;
  }
  // You can redirect the user or update the state after logout, if needed
  console.log("User logged out");
  redirect("/login");
}
