"use client";

//import DashboardPosts from "@/ui/components/dashboard-posts";
import { useState, useEffect } from "react";
import { getAllPosts } from "@/app/explore/action";
import { Post, Category } from "@/lib/types";
import { useForm, SubmitHandler } from "react-hook-form";
import SearchForm from "@/ui/forms/search-posts";
import { z } from "zod";

export default function Explore() {
  const [state, setState] = useState<{
    posts: Post[];
    latestPosts: Post[];
    searchResults: Post[];
    view: string;
  }>({
    posts: [],
    latestPosts: [],
    searchResults: [],
    view: "latest",
  });

  const [categories, setCategories] = useState<Category[]>([]);

  const SearchFormSchema = z.object({
    search: z.string().min(1, "Search is required"),
    category: z.string().optional(),
  });

  // Define the type for form data
  type SearchFormValues = z.infer<typeof SearchFormSchema>;

  const onSubmit: SubmitHandler<SearchFormValues> = async (data) => {
    console.log("Form submitted with data:", data);
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await getAllPosts();
        if (response.success) {
          setState((prev) => ({
            ...prev,
            posts: response.posts ?? [], // Directly assign the posts array
            latestPosts: (response.posts ?? []).slice(-8).reverse(),
            view: "latest",
          }));
        }
      } catch (error) {
        console.error(error);
      }
    }

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
    fetchPosts();
  }, []);

  return (
    <>
      <section>
        <div className="light:bg-zinc-50 min-h-screen">
          {/* Title Section */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-2">
              Explore
            </h2>
            <div className="h-1 w-1/4 bg-rose-500 mx-auto mb-6"></div>
            <p className="text-center light:text-gray-600 text-lg mb-6">
              Discover Content Tailored to Your Interests and Passions.
            </p>
          </div>

          {/* Form Section */}

          <SearchForm categories={categories} onSubmit={onSubmit} />

          {/* Posts Section */}
          {/* <DashboardPosts /> */}
        </div>
      </section>
    </>
  );
}
