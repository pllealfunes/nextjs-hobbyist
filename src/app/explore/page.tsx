"use client";

import DashboardPosts from "@/ui/components/dashboard-posts";
import { useState, useEffect } from "react";
import { getMatchingPosts, getLatestPosts } from "@/app/explore/action";
import { Post } from "@/lib/types";
import { SubmitHandler } from "react-hook-form";
import SearchForm from "@/ui/forms/explore-posts";
import { SearchFormValues } from "@/ui/forms/explore-posts";
import { Skeleton } from "@/ui/components/skeleton";
import NoResults from "@/ui/components/no-results";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationItem,
  PaginationNext,
  PaginationLink,
} from "@/ui/components/pagination";
import { toast } from "react-hot-toast";

export default function Explore() {
  const [results, setResults] = useState<Post[]>([]);
  const [showLatest, setShowLatest] = useState(true);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const latestPageSize = 4;
  const searchPageSize = 5;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const postsResponse = await getLatestPosts({
          page: currentPage,
          pageSize: latestPageSize,
        });

        if (postsResponse.success) {
          setLatestPosts(postsResponse.posts ?? []);
          setTotalPages(
            Math.ceil((postsResponse.totalCount ?? 1) / latestPageSize)
          );
        }
      } catch (error) {
        console.error("Error loading categories or posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const onSubmit: SubmitHandler<SearchFormValues> = async (data) => {
    setShowLatest(false);
    setResults([]);
    setShowNoResults(false);
    setSearchPage(1);
    setIsLoading(true);

    try {
      const requestData = {
        ...data,
        category: data.category === "None" ? undefined : Number(data.category),
        search: data.search?.trim() ?? "",
      };
      console.log("Search request:", requestData);

      const searchResults = await getMatchingPosts({
        ...requestData,
        page: 1,
        pageSize: searchPageSize,
      });

      if (searchResults.success) {
        const posts = searchResults.posts ?? [];

        setResults(posts);
        setShowNoResults(posts.length === 0);
        setTotalPages(
          Math.ceil((searchResults.totalCount ?? 1) / searchPageSize)
        );
      } else {
        setShowNoResults(true);
      }
    } catch (error) {
      toast.error(`Error fetching posts: ${error}`);
      setShowNoResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resetResults = () => {
    setResults([]);
    setShowLatest(true);
    setShowNoResults(false);
  };
  return (
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
        <SearchForm onSubmit={onSubmit} resetResults={resetResults} />

        {/* Posts Section */}
        <div className="w-full min-h-[50vh] flex flex-col items-center justify-center">
          {/* Skeleton Loader */}
          {isLoading && (
            <div className="flex justify-center items-center gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="w-64 h-80 rounded-md" />
              ))}
            </div>
          )}

          {/* Latest Posts */}
          {!isLoading && showLatest && latestPosts.length > 0 && (
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-3xl mb-5">Latest Posts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
                {latestPosts.map((post) => (
                  <DashboardPosts key={post.id} post={post} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination className="mt-5">
                  <PaginationContent>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
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
          )}

          {/* Search Results */}
          {!isLoading && results.length > 0 && (
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-3xl mb-5">Search Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
                {results.map((post) => (
                  <DashboardPosts key={post.id} post={post} />
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
          )}

          {/* No Results */}
          {!isLoading && showNoResults && <NoResults />}
        </div>
      </div>
    </section>
  );
}
