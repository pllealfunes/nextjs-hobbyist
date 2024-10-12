"use client";
import TextEditor from "@/ui/components/TextEditor";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/form";

// Define the type for the 'html' parameter
function extractTextFromHTML(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent?.trim() || "";
}

// Validation schema
const formSchema = z.object({
  post: z.string().refine(
    (value) => {
      return extractTextFromHTML(value).trim().length >= 5;
    },
    {
      message: "The text must be at least 500 characters long after trimming",
    }
  ),
  title: z.string().min(1, "Title is required"), // Title validation
});

// Define the type for form data
type FormData = z.infer<typeof formSchema>;

export default function CreatePost() {
  const form = useForm<FormData>({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
    defaultValues: {
      post: "",
      title: "",
    },
  });

  // Define the type for 'data'
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <div className="max-w-3xl mx-auto py-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter the title"
                    className="mb-2 w-full border rounded-md p-2 text-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Post Field */}
          <FormField
            control={form.control}
            name="post"
            render={({ field }) => (
              <FormItem className="my-2">
                <FormLabel>Post</FormLabel>
                <FormControl>
                  <TextEditor
                    content={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="mt-4">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
