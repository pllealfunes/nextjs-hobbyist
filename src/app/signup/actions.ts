"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function SignupAction(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    name: formData.get("name") as string,
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  // if (error) {
  //   console.log(error);

  //   return redirect("/error");
  // }

  // return redirect("/dashboard");
  console.log(error);
}
