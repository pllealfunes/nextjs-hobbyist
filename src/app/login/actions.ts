"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export async function LoginAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return redirect("/error");
  }
  return redirect("/dashboard");
}
