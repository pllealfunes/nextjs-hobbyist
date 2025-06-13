"use server";
import { createClient } from "@/utils/supabase/server";
import { LoginResult } from "@/lib/types";

export async function LoginAction(formData: FormData): Promise<LoginResult> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      fields: ["email", "password"], // highlight both fields
      message: "Invalid email or password.",
    };
  }

  return { success: true };
}
