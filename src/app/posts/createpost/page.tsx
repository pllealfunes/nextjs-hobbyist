"use client";
import { useState, useEffect } from "react";
import TextEditor from "@/ui/components/TextEditor";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { useRouter } from "next/navigation";
import CoverPhotoUploader from "@/ui/components/coverphoto-uploader";
import { CreatePostSchema } from "@/app/schemas";
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

// Define the type for form data
type FormData = z.infer<typeof CreatePostSchema>;

type Category = {
  id: number;
  name: string;
};

export default function CreatePost() {
  const router = useRouter();

  const form = useForm<FormData>({
    mode: "onTouched",
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: "",
      category: "",
      coverPhoto: "",
      content: "",
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
          category_id: parseInt(data.category),
          coverPhoto: data.coverPhoto,
          content: data.content,
        }),
      });

      if (response.ok) {
        const post = await response.json();
        console.log("Post created successfully", post);
        router.push(`/posts/${post.id}`);
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
                    onValueChange={(value) => field.onChange(value)}
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
          {/* Cover Photo Field */}
          <FormField
            control={form.control}
            name="coverPhoto"
            render={({ field }) => (
              <FormItem className="my-2">
                <FormLabel className="text-lg">Cover Photo</FormLabel>
                <FormControl>
                  <CoverPhotoUploader onUpload={(url) => field.onChange(url)} />
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
          <FormDescription>Use The Form to Create a New Post</FormDescription>
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
