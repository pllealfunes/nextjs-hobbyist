import React from "react";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { CreatePostSchema } from "@/app/schemas";
import PhotoUploader from "@/ui/components/photo-uploader";
import TextEditor from "@/ui/components/TextEditor";
import { Post } from "@/lib/types";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/form";
import Image from "next/image";
import { useCategoriesQuery } from "@/hooks/categoriesQuery";

// Define the type for form data
type FormData = z.infer<typeof CreatePostSchema>;

interface EditPostFormProps {
  post: Post;
  onSubmit: SubmitHandler<FormData>;
  isDeleted: boolean;
  setIsDeleted: (value: boolean) => void;
}

export default function EditPostForm({
  post,
  onSubmit,
  isDeleted,
  setIsDeleted,
}: EditPostFormProps) {
  const [coverPhoto, setCoverPhoto] = useState(post.coverphoto);
  const { data: categories } = useCategoriesQuery();

  const form = useForm<FormData>({
    mode: "onTouched",
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: post?.title ?? "",
      category: post?.category_id.toString() ?? "",
      coverphoto: undefined,
      content: post?.content ?? "",
      published: post?.published ?? "",
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        category: post.category_id?.toString() ?? "",
        content: post.content ?? "",
        published: post.published ?? false,
      });
    }
  }, [post, form]);

  const handleDeleteCoverPhoto = async () => {
    try {
      setCoverPhoto("");
      setIsDeleted(true);
      form.setValue("coverphoto", undefined);
    } catch (error) {
      console.error("Error deleting cover photo:", error);
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
                <FormLabel htmlFor="title" className="text-lg">
                  Title
                </FormLabel>
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
              <FormItem className="my-2">
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
                      {categories?.map((category) => (
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
            name="coverphoto"
            render={() => (
              <FormItem className="my-2">
                <FormLabel htmlFor="coverphoto" className="text-lg">
                  Cover Photo
                </FormLabel>
                <FormControl>
                  {coverPhoto && !isDeleted ? (
                    <div>
                      <Image
                        src={coverPhoto}
                        alt="Cover Photo Preview"
                        width={200}
                        height={200}
                        className="rounded-lg"
                      />
                      <Button className="mt-4" onClick={handleDeleteCoverPhoto}>
                        Remove Cover Photo
                      </Button>
                    </div>
                  ) : (
                    <PhotoUploader
                      onImageSelect={(image) => {
                        console.log("Selected Image Base64:", image);
                        form.setValue("coverphoto", image ?? undefined);
                      }}
                    />
                  )}
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
                <FormLabel htmlFor="content" className="text-lg">
                  Post
                </FormLabel>
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
          </div>
          <div className="flex justify-between gap-2 items-center">
            <Button
              type="submit"
              className="ml-2"
              onClick={() => form.setValue("published", false)}
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              className="ml-2"
              onClick={() => form.setValue("published", true)}
            >
              Publish
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
