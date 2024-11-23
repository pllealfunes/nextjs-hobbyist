"use client";
import TextEditor from "@/ui/components/TextEditor";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
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
      return extractTextFromHTML(value).trim().length >= 200;
    },
    {
      message: "The text must be 200 to 12500 characters long after trimming",
    }
  ),
  title: z.string().min(10, "Title is required"), // Title validation
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
                <FormLabel className="text-lg">Edit Title</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel className="text-lg">Edit Post</FormLabel>
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

          {/* Container for Word Count and Submit Button */}
          <div className="flex justify-end items-end mt-4">
            <div className="mr-4">
              {/* Word Count component */}
              {/* Assuming your word count is displayed inside the TextEditor */}
            </div>
            <Button className="ml-2">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
