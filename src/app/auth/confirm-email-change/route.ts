import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = "/dashboard";

  // Create redirect link without the secret token
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (token_hash && type === "email_change") {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type: "email_change",
      token_hash,
    });

    if (error) {
      console.error("OTP verification error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/error";

  return NextResponse.redirect(redirectTo);
}
