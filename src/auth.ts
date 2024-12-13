import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
// Your own logic for dealing with plaintext password strings; be careful!
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma";
import { LoginSchema } from "@/app/schemas";
import { PrismaAdapter } from "@auth/prisma-adapter";

declare module "next-auth" {
  interface Credentials {
    email: string;
    password: string;
  }
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      address: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          console.log("Invalid credentials");
          return null;
        }

        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          console.log("Validation failed");
          return null;
        }

        const { email, password } = validatedFields.data;

        // ERROR LOOKING FOR USER -> PRISMA FAILED CONNECTTION?
        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user) {
          console.log("User not found");
          return null;
        }

        // ERROR AROUND HERE
        const isValidPassword = user.password
          ? await bcrypt.compare(password, user.password)
          : false;

        if (!isValidPassword) {
          console.log("Invalid password");
          return null;
        }

        // Return user object without sensitive data
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        } as User;
      },
    }),
  ],
});
