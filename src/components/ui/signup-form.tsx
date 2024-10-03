"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters." })
    .max(15),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(15),
  email: z
    .string()
    .email()
    .min(5, { message: "Email must be at least 5 characters." }),
  password: z
    .string()
    .min(5, { message: "Please choose a strong password." })
    .max(15),
  passConfirmation: z
    .string()
    .min(5, { message: "Please confirm the password by typing it again." })
    .max(15),
  description: z.string().optional(),
  private: z.boolean().optional(),
  image: z.instanceof(File).optional().nullable(),
});

export default function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      passConfirmation: "",
      description: "",
      private: false,
      image: null,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Handle file input changes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setValue("image", file);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const removeImage = () => {
    setPreview(null);
    hiddenFileInputRef.current!.value = "";
    setValue("image", null);
  };

  const triggerFileInput = () => hiddenFileInputRef.current?.click();

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="upload">
          {!preview && (
            <button type="button" onClick={triggerFileInput}>
              Upload Image
            </button>
          )}

          {preview && (
            <div className="preview">
              <Image
                src={preview}
                className="img"
                alt="profilePicture"
                height={50}
                width={50}
              />
              <div className="buttons">
                <button type="button" onClick={triggerFileInput}>
                  Change Image
                </button>
                <button type="button" onClick={removeImage}>
                  Remove Image
                </button>
              </div>
            </div>
          )}
          <input
            {...register("image")}
            ref={hiddenFileInputRef}
            hidden
            type="file"
            onChange={handleFileChange}
          />
          <p className="error">{errors.image && errors.image.message}</p>
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="BobsBurgers" {...field} />
              </FormControl>
              <FormDescription>Enter your username.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="bobsburgers@email.com" {...field} />
              </FormControl>
              <FormDescription>Enter your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-center">
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Crochet Enthusiast. Looking to Share and Learn from Others."
                />
              </FormControl>
              <FormDescription>Describe yourself</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-rose-500 hover:bg-rose-600 text-white"
        >
          {isSubmitting ? "Loading" : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
