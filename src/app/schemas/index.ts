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
    .min(8, { message: "Name must be at least 8 characters." })
    .max(15),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
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
  coverphoto: z.instanceof(File).optional(),
  content: z.string().refine(
    (value) => {
      return extractTextFromHTML(value).trim().length >= 200;
    },
    {
      message: "A post must be 200 to 12500 characters long after trimming",
    }
  ),
  published: z.boolean(),
});

export const CreateCommentSchema = z.object({
  content: z
    .string()
    .min(5, "A minimium of at least 5 characters is required")
    .max(200),
});

export const ProfileDetailsSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name cannot exceed 30 characters." }),

  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(20, { message: "Username cannot exceed 20 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  bio: z
    .string()
    .max(160, { message: "Bio cannot exceed 160 characters." })
    .optional(),

  links: z
    .array(
      z.object({
        label: z.string().min(2, "Label is required"),
        url: z.string().url("Must be a valid URL"),
      })
    )
    .optional(),
});

export const AvatarSchema = z.object({
  photo: z.instanceof(File).optional(),
});

export const EmailSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email.",
  }),
});

export const PasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, {
      message: "Please choose a strong password with a min of 8 characters.",
    })
    .max(15),
  newPassword: z
    .string()
    .min(8, {
      message: "Please choose a strong password with a min of 8 characters.",
    })
    .max(15),
  passConfirmation: z
    .string()
    .min(8, { message: "Please confirm the password by typing it again." })
    .max(15),
});
