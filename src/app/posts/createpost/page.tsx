"use client";
import { useState, useEffect } from "react";
import TextEditor from "@/ui/components/TextEditor";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/select";

import {
  Form,
  FormControl,
  FormDescription,
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
  content: z.string().refine(
    (value) => {
      return extractTextFromHTML(value).trim().length >= 200;
    },
    {
      message: "A post must be 200 to 12500 characters long after trimming",
    }
  ),
  title: z.string().min(10, "A Title of at least 10 characters is required"),
  category: z.string().min(1, "Category is required"),
});

// Define the type for form data
type FormData = z.infer<typeof formSchema>;

type Category = {
  id: number;
  name: string;
};

export default function CreatePost() {
  const form = useForm<FormData>({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      category: "",
      title: "",
    },
  });

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    }

    loadCategories();
  }, []);

  // Define the type for 'data'
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          categoryId: parseInt(data.category),
          content: data.content,
        }),
      });

      if (response.ok) {
        const post = await response.json();
        console.log("Post created successfully", post);
      } else {
        console.error("Error creating post");
      }
    } catch (error) {
      console.error("Error creating post", error);
    }
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
                <FormLabel className="text-lg">Title</FormLabel>
                <FormControl>
                  <Input
                    className="mb-2 w-full border rounded-md p-2 text-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Category Field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="category" className="text-lg">
                  Category
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Post Field */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="my-2">
                <FormLabel className="text-lg">Post</FormLabel>
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
          <FormMessage />
          <FormDescription>Use The Form to Freate a New Post</FormDescription>
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
