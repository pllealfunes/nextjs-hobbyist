import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email.",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters.",
  }),
});

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters." })
    .max(15),
  username: z
    .string()
    .min(5, { message: "Username must be at least 2 characters." })
    .max(15),
  email: z.string().email({
    message: "Enter a valid email.",
  }),
  password: z
    .string()
    .min(5, { message: "Please choose a strong password." })
    .max(15),
  passConfirmation: z
    .string()
    .min(5, { message: "Please confirm the password by typing it again." })
    .max(15),
  description: z.string().optional(),
});
