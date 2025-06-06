"use client";

import DashboardPosts from "@/ui/components/dashboard-posts";
import { useState, useEffect } from "react";
import { getMatchingPosts, getLatestPosts } from "@/app/explore/action";
import { Post, Category } from "@/lib/types";
import { SubmitHandler } from "react-hook-form";
import SearchForm from "@/ui/forms/search-posts";
import { SearchFormValues } from "@/ui/forms/search-posts";
import { Skeleton } from "@/ui/components/skeleton";
import { Search, FileText } from "lucide-react";

export default function Explore() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<Post[]>([]);
  const [showLatest, setShowLatest] = useState(true);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function fetchLatestPosts() {
      try {
        const response = await getLatestPosts();
        if (response.success) {
          setLatestPosts(response.posts ?? []);
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
    fetchLatestPosts();
    setIsLoading(false);
  }, []);

  const onSubmit: SubmitHandler<SearchFormValues> = async (data) => {
    setShowLatest(false);
    setResults([]);
    setIsLoading(true); // Start loading

    try {
      const requestData = {
        ...data,
        category: data.category === "None" ? undefined : Number(data.category),
        search: data.search ?? "",
      };

      const searchResults = await getMatchingPosts(requestData);

      if (!searchResults.success) {
        setResults([]);
      } else {
        setResults(searchResults.posts ?? []);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
    }
  };

  const resetResults = () => {
    setResults([]);
    setShowLatest(true);
  };

  return (
    <>
      <section>
        <div className="light:bg-zinc-50 min-h-screen flex flex-col items-center">
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
          <div className="w-full min-h-[50vh] flex flex-col items-center justify-center">
            {isLoading ? (
              /* Skeleton Loader */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="w-full h-24 rounded-md" />
                ))}
              </div>
            ) : showLatest ? (
              /* Latest Posts */
              <div className="transition-opacity duration-500 opacity-100 flex flex-col items-center">
                <h3 className="font-bold text-3xl mb-5">Latest Posts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
                  {latestPosts.map((post) => (
                    <DashboardPosts
                      key={post.id}
                      post={post}
                      categories={categories}
                    />
                  ))}
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
                {results.map((post) => (
                  <DashboardPosts
                    key={post.id}
                    post={post}
                    categories={categories}
                  />
                ))}
              </div>
            ) : (
              /* No Posts Found */
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-6">
                  <FileText className="w-8 h-8 text-rose-400" />
                </div>
                <h3 className="text-3xl font-semibold mb-2">No Posts Found</h3>
                <p className="max-w-md mb-6">
                  We couldn&apos;t find any posts matching your search criteria.
                  Try adjusting your filters or search terms.
                </p>
                <div className="flex items-center gap-2 text-sm">
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
