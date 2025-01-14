"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function SignupAction(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        name: formData.get("name") as string,
        username: formData.get("username") as string,
      },
    },
  };
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error);

    return redirect("/error");
  }

  return redirect("/verify-email");
}
