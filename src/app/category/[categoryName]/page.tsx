"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardPosts from "@/ui/components/dashboard-posts";
import NoResults from "@/ui/components/no-results";
import { Post, Category } from "@/lib/types";
import { getCategoryWithPosts } from "@/app/server/categoryActions";
import { SubmitHandler } from "react-hook-form";
import SearchForm from "@/ui/forms/search-form";
import { SearchFormValues } from "@/ui/forms/search-form";
import { Skeleton } from "@/ui/components/skeleton";
import { Button } from "@/ui/components/button";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationItem,
  PaginationNext,
  PaginationLink,
} from "@/ui/components/pagination";
import { Minus, Plus } from "lucide-react";

const CategoryPage = () => {
  const params = useParams();
  const categoryName = params?.categoryName as string | undefined;
  const [displayCategory, setDisplayCategory] = useState<string | undefined>(
    undefined
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showLatest, setShowLatest] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const latestPageSize = 4;
  const searchPageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [isFollowing, setIsFollowing] = useState(false);

  const capitalizeFirstLetter = (str?: string) => {
    if (!str) return "This category";

    if (str.toLowerCase() === "games+puzzles") {
      return "Games+Puzzles";
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    if (!categoryName) return;

    const fetchData = async () => {
      try {
        console.log("Fetching posts for category:", categoryName);
        setIsLoading(true); // Start loading before fetching

        const [categoriesResponse, postsResponse] = await Promise.all([
          fetch("/api/categories"),
          getCategoryWithPosts(categoryName),
        ]);

        const categoriesData: Category[] = await categoriesResponse.json();
        const postsData = postsResponse.posts;

        setCategories(categoriesData);
        setPosts(postsData ?? []);
        setDisplayCategory(
          capitalizeFirstLetter(decodeURIComponent(categoryName))
        );
      } catch (error) {
        console.error("Error fetching posts", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryName]);

  const onSubmit: SubmitHandler<SearchFormValues> = (data) => {
    setIsLoading(true);
    setShowLatest(false);
    setResults([]);
    try {
      const searchTerm = data.search?.toLowerCase().trim() || "";

      const matchingPosts =
        searchTerm.length > 0
          ? posts.filter((post) => {
              const title = post.title?.toLowerCase() || "";
              const content = post.content?.toLowerCase() || "";
              return title.includes(searchTerm) || content.includes(searchTerm);
            })
          : [];

      const totalFilteredPages = Math.ceil(
        matchingPosts.length / searchPageSize
      );
      setTotalPages(totalFilteredPages);
      setSearchPage(1);

      const paginatedResults = matchingPosts.slice(0, searchPageSize);
      setResults(paginatedResults);
    } catch (error) {
      console.error("❌ Error filtering posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetResults = () => {
    setResults(posts);
  };

  const handleFollow = () => {
    setIsFollowing((prevState) => !prevState);
    console.log(isFollowing);
  };

  return (
    <div>
      {/* Title Section */}
      <div>
        <div className="flex justify-center align-center gap-3">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-2">
            {displayCategory}
          </h2>
          <Button onClick={handleFollow} className="mt-2">
            {isFollowing ? <Minus /> : <Plus />}
          </Button>
        </div>
        <div className="h-1 w-1/4 bg-rose-500 mx-auto mb-6"></div>
        <p className="text-center text-lg mb-6">
          Stay updated with the latest posts and insights from our community.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-24 rounded-md" />
            ))}
          </div>
        ) : results.length > 0 ? (
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
          </div>
        ) : showLatest ? (
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-3xl mb-5">
              {displayCategory} Latest Posts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
              {posts.map((post) => (
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
        ) : (
          <NoResults />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
