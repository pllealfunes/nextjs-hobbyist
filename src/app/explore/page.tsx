"use client";

import DashboardPosts from "@/ui/components/dashboard-posts";
import { useState, useEffect } from "react";
import { getAllPosts, getMatchingPosts } from "@/app/explore/action";
import { Post, Category } from "@/lib/types";
import { SubmitHandler } from "react-hook-form";
import SearchForm from "@/ui/forms/search-posts";
import { SearchFormValues } from "@/ui/forms/search-posts";
import { toast } from "react-hot-toast";
import { Search, FileText } from "lucide-react";

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
  const [results, setResults] = useState<Post[]>([]);

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
    console.log(state);
  }, []);

  const onSubmit: SubmitHandler<SearchFormValues> = async (data) => {
    setResults([]);
    await toast.promise(
      (async () => {
        if (!data) {
          toast.error("Failed to Get Posts Due to Incorrect Data");
          return [];
        }

        try {
          const selectedCategory = categories.find(
            (category) => category.name === data.category
          );

          const requestData = {
            ...data,
            category: selectedCategory ? selectedCategory.id : undefined,
          };

          const searchResults = await getMatchingPosts(requestData);

          if (!searchResults.success) {
            throw new Error(searchResults.error || "Failed to fetch posts");
          }

          console.log("Retrieved posts:", searchResults.posts); // Debugging
          if (searchResults.success && Array.isArray(searchResults.posts)) {
            return setResults(searchResults.posts); // ✅ Ensures valid posts
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
          throw error; // Let toast handle the error
        }
      })(),
      {
        loading: "Searching For Posts...",
        success: "Successfully Found Posts",
        error: (err) =>
          `Something went wrong while searching for posts: ${err.toString()}`,
      }
    );
  };

  const resetResults = () => {
    setResults([]);
  };

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

          <SearchForm
            categories={categories}
            onSubmit={onSubmit}
            resetResults={resetResults}
          />

          {/* Posts Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.length > 0 ? (
              results.map((post) => (
                <DashboardPosts
                  key={post.id}
                  post={post}
                  categories={categories}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-24 px-4">
                <div className="flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-6">
                  <FileText className="w-8 h-8 text-rose-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  No Posts Found
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  We couldn't find any posts matching your search criteria. Try
                  adjusting your filters or search terms.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Search className="w-4 h-4 text-rose-400" />
                  <span>Try a different search</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
