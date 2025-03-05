import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { CreatePostSchema } from "@/app/schemas";
import CoverPhotoUploader from "@/ui/components/coverphoto-uploader";
import TextEditor from "@/ui/components/TextEditor";
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
import Published from "@/app/posts/published/page";

// Define the type for form data
type FormData = z.infer<typeof CreatePostSchema>;

type Category = {
  id: number;
  name: string;
};

const CreatePostForm: React.FC<{
  categories: Category[];
  onSubmit: SubmitHandler<FormData>;
}> = ({ categories, onSubmit }) => {
  const form = useForm<FormData>({
    mode: "onTouched",
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: "",
      category: "",
      coverphoto: undefined,
      content: "",
      published: false,
    },
  });

  const router = useRouter();

  const saveAsDraft = async (data: FormData) => {
    console.log(data);

    try {
      const response = await fetch("/api/posts/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          category_id: parseInt(data.category, 10),
          content: data.content,
          coverphoto: data.coverphoto,
          published: false,
        }),
      });

      if (!response.ok) throw new Error("Failed to save draft");

      const draft = await response.json();
      console.log("Draft saved:", draft);
      router.push("/posts/drafts");
    } catch (error) {
      console.error("Error saving draft:", error);
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
            name="coverphoto"
            render={() => (
              <FormItem className="my-2">
                <FormLabel htmlFor="coverphoto" className="text-lg">
                  Cover Photo
                </FormLabel>
                <FormControl>
                  <CoverPhotoUploader
                    onImageSelect={(image) => {
                      console.log("Selected Image Base64:", image); // Debugging log
                      form.setValue("coverphoto", image ?? undefined);
                    }}
                  />
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
              Save as Draft
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
};

export default CreatePostForm;
