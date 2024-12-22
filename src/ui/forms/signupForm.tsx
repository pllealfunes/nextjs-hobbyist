"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/ui/components/input";
import { Textarea } from "@/ui/components/textarea";
import { SignUpSchema } from "@/app/schemas";
import { Button } from "@/ui/components/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/form";
import { SignupAction } from "@/app/signup/actions";

const router = useRouter();

export default function SignupForm() {
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      passConfirmation: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    try {
      const formData = new FormData();
      formData.append("name", values.password);
      formData.append("username", values.password);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("bio", values.password);
      await SignupAction(formData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Bob Belcher" {...field} />
              </FormControl>
              <FormDescription>Enter your name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="BestBurgers1" {...field} />
              </FormControl>
              <FormDescription>Enter your password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Confirmation</FormLabel>
              <FormControl>
                <Input placeholder="BestBurgers1" {...field} />
              </FormControl>
              <FormDescription>Enter your password again.</FormDescription>
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
          className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-3 sm:px-4 transition duration-300 leading-6 shadow-rose-300 shadow-lg"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
