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
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationItem,
  PaginationNext,
  PaginationLink,
} from "@/ui/components/pagination";

export default function Explore() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<Post[]>([]);
  const [showLatest, setShowLatest] = useState(true);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const [searchPage, setSearchPage] = useState(1);
  const latestPageSize = 4;
  const searchPageSize = 5;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchLatestPosts(page = 1) {
      setIsLoading(true);
      try {
        const response = await getLatestPosts({
          page,
          pageSize: latestPageSize,
        });
        if (response.success) {
          setLatestPosts(response.posts ?? []);
          setTotalPages(
            Math.ceil((response?.totalCount ?? 1) / latestPageSize)
          );
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
    fetchLatestPosts(currentPage);
    setIsLoading(false);
  }, []);

  const onSubmit: SubmitHandler<SearchFormValues> = async (data) => {
    setShowLatest(false);
    setResults([]);
    setIsLoading(true);

    try {
      const requestData = {
        ...data,
        category: data.category === "None" ? undefined : Number(data.category),
        search: data.search ?? "",
      };

      const searchResults = await getMatchingPosts({
        ...requestData,
        page: searchPage,
        pageSize: searchPageSize,
      });

      setResults(searchResults.success ? searchResults.posts ?? [] : []);
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
    } finally {
      setIsLoading(false);
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
              <div className="flex flex-col items-center">
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
                {totalPages > 1 && (
                  <Pagination className="mt-5">
                    <PaginationContent>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault(); // Stops the page reload
                          if (currentPage > 1)
                            setCurrentPage((prev) => prev - 1);
                        }}
                      />
                      {Array.from({ length: totalPages }, (_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            href="#"
                            isActive={index + 1 === currentPage}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            setCurrentPage((prev) => prev + 1);
                        }}
                      />
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            ) : results.length > 0 ? (
              /* Search Results */
              <div className="flex flex-col items-center">
                <h3 className="font-bold text-3xl mb-5">Search Results</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
                  {results.map((post) => (
                    <DashboardPosts
                      key={post.id}
                      post={post}
                      categories={categories}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination className="mt-5">
                    <PaginationContent>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (searchPage > 1) setSearchPage((prev) => prev - 1);
                        }}
                      />
                      {Array.from({ length: totalPages }, (_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            href="#"
                            isActive={index + 1 === searchPage}
                            onClick={() => setSearchPage(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (searchPage < totalPages)
                            setSearchPage((prev) => prev + 1);
                        }}
                      />
                    </PaginationContent>
                  </Pagination>
                )}
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
