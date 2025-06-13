"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from "@/app/schemas";
import { Button } from "@/ui/components/button";
import { LoginAction } from "@/app/login/actions";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/form";
import { Input } from "@/ui/components/input";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);

      const toastId = toast.loading("Logging you in...");

      const result = await LoginAction(formData);

      if ("fields" in result) {
        result.fields.forEach((field) => {
          form.setError(field, {
            type: "manual",
            message: result.message,
          });
        });
        toast.error(result.message, { id: toastId });
        return;
      }

      if ("message" in result) {
        toast.error(result.message, { id: toastId });
        return;
      }

      if (result.success) {
        toast.success("Welcome back!", { id: toastId });

        setTimeout(() => {
          router.push("/dashboard");
        }, 200);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="bobsburgers@exampl.com" {...field} />
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
                <Input placeholder="Skittles123" {...field} />
              </FormControl>
              <FormDescription>Enter your password.</FormDescription>
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
