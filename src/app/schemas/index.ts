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
});

// Define the type for the 'html' parameter
function extractTextFromHTML(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent?.trim() || "";
}

export const CreatePostSchema = z.object({
  title: z.string().min(10, "A Title of at least 10 characters is required"),
  category: z.string().min(1, "Category is required"),
  coverphoto: z.string().url("Cover photo must be a valid URL").optional(),
  content: z.string().refine(
    (value) => {
      return extractTextFromHTML(value).trim().length >= 200;
    },
    {
      message: "A post must be 200 to 12500 characters long after trimming",
    }
  ),
});
