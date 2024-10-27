"use client";

import DashboardPosts from "@/ui/components/dashboard-posts";
import { Button } from "@/ui/components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/select";
import { Input } from "@/ui/components/input";

const formSchema = z.object({
  search: z.string().min(2, {
    message: "Search cannnot be empty",
  }),
  category: z.string().optional(),
});

export default async function Explore() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
      category: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      <section className="py-16 sm:py-24 px-6 sm:px-12 flex flex-col items-center gap-10 bg-gradient-to-b from-rose-50 to-rose-100 rounded-3xl shadow-lg">
        <div className="bg-gradient-to-br from-rose-200 to-rose-500 py-14 sm:py-24 px-8 sm:px-16 rounded-3xl flex flex-col items-center gap-8 shadow-lg">
          {/* Title Section */}
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-5xl font-extrabold tracking-tight text-white">
              Explore
            </h2>
            <p className="text-lg sm:text-xl text-white max-w-md">
              Discover content tailored to your interests and passions.
            </p>
          </div>

          {/* Form Section */}
          <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-md text-gray-800">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Search
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type what you're looking for..."
                          className="border border-gray-300 rounded-md focus:border-rose-400 focus:ring-rose-300"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Enter keywords to find what you love
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Category
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full border border-gray-300 rounded-md focus:border-rose-400 focus:ring-rose-300">
                            <SelectValue placeholder="Choose a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel className="text-gray-500">
                                Categories
                              </SelectLabel>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="physical">Physical</SelectItem>
                              <SelectItem value="mental">Mental</SelectItem>
                              <SelectItem value="food">Food</SelectItem>
                              <SelectItem value="musical">Musical</SelectItem>
                              <SelectItem value="collecting">
                                Collecting
                              </SelectItem>
                              <SelectItem value="games/puzzles">
                                Games/Puzzles
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-md shadow-md transition duration-300 ease-in-out"
                >
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="mt-16">
        <DashboardPosts />
      </section>
    </>
  );
}
