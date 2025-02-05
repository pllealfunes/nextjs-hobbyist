import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    console.log("Fetching user with ID:", userId); // Debugging

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// import { type EmailOtpType } from "@supabase/supabase-js";
// import { type NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/server";
// import prisma from "@/lib/prisma";

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const token_hash = searchParams.get("token_hash");
//   const type = searchParams.get("type") as EmailOtpType | null;
//   const next = "/dashboard";

//   const redirectTo = request.nextUrl.clone();
//   redirectTo.pathname = next;
//   redirectTo.searchParams.delete("token_hash");
//   redirectTo.searchParams.delete("type");

//   if (token_hash && type) {
//     const supabase = await createClient();
//     const { error } = await supabase.auth.verifyOtp({
//       type,
//       token_hash,
//     });

//     if (!error) {
//       try {
//         // Fetch user details after OTP verification
//         const user = await prisma.user.findUnique({
//           where: { id: token_hash }, // Ensure this id correlates to your user schema
//         });

//         if (!user) {
//           console.error("User not found after verification");
//           redirectTo.pathname = "/error";
//           return NextResponse.redirect(redirectTo);
//         }

//         // Redirect to the project page or desired route
//         redirectTo.searchParams.set("userId", user.id);
//         return NextResponse.redirect(redirectTo);
//       } catch (error) {
//         console.error("Error fetching user data after verification:", error);
//       }
//     } else {
//       console.error("Error verifying OTP:", error.message);
//     }
//   }

//   redirectTo.pathname = "/error";
//   return NextResponse.redirect(redirectTo);
// }
