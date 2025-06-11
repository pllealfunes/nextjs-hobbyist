"use client";

import { useAuth } from "@/contexts/authContext";
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
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationItem,
  PaginationNext,
  PaginationLink,
} from "@/ui/components/pagination";
import FollowCategoryButton from "@/ui/components/follow-category-lg";
import {
  fetchFollowState,
  toggleFollowCategory,
} from "@/app/server/categoryActions";

export default function CategoryPage() {
  const { user } = useAuth();
  const params = useParams();
  const categoryName = params?.categoryName as string | undefined;
  const [displayCategory, setDisplayCategory] = useState<string | undefined>(
    undefined
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showLatest, setShowLatest] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<Post[]>([]);
  const [showNoResults, setShowNoResults] = useState(false);
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
    setIsLoading(true);

    const fetchData = async () => {
      try {
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
        setShowNoResults(postsData?.length === 0);

        // ✅ Call getFollowState with freshly fetched data
        const category = categoriesData.find(
          (cat) =>
            cat.name.toLowerCase() ===
            decodeURIComponent(categoryName).toLowerCase()
        );

        if (!category) {
          console.error("Category not found:", categoryName);
          return;
        }

        const followStatus = await fetchFollowState(category.id);
        setIsFollowing(followStatus);
      } catch (error) {
        console.error("Error fetching posts or follow state", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, categoryName]);

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
      setShowNoResults(paginatedResults?.length === 0);
    } catch (error) {
      console.error("❌ Error filtering posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetResults = () => {
    setResults([]);
    setShowLatest(true);
  };

  const handleFollow = async () => {
    if (!categoryName) return;

    // Find category by name
    const category = categories.find((cat) => cat.name === displayCategory);
    console.log(category);

    if (!category) {
      console.error("Category not found:", categoryName);
      return;
    }

    try {
      const newFollowState = await toggleFollowCategory(category.id); // ✅ Pass valid category ID
      setIsFollowing(newFollowState); // ✅ Update state based on response
    } catch (error) {
      console.error("❌ Error toggling follow state:", error);
    }
  };

  const latestPosts = posts.slice(
    (currentPage - 1) * latestPageSize,
    currentPage * latestPageSize
  );
  const searchResults = results.slice(
    (searchPage - 1) * searchPageSize,
    searchPage * searchPageSize
  );

  return (
    <>
      {/* Title Section */}
      <section>
        <div className="flex justify-center items-center gap-3">
          {isLoading ? (
            <Skeleton className="w-64 h-14 rounded-md" />
          ) : (
            <div className="flex justify-center items-center gap-3">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-2">
                {displayCategory}
              </h2>
              <FollowCategoryButton
                isFollowing={isFollowing}
                handleFollow={handleFollow}
              />
            </div>
          )}
        </div>
        <div className="h-1 w-1/4 bg-rose-500 mx-auto mb-6"></div>
        <p className="text-center text-lg mb-6">
          Stay updated with the latest posts and insights from our community.
        </p>
      </section>

      {/* Form Section */}
      <SearchForm
        categories={categories}
        onSubmit={onSubmit}
        resetResults={resetResults}
      />

      {/* Posts Section */}
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center">
        {isLoading && (
          <div className="flex justify-center items-center gap-3 w-full">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="w-64 h-80 rounded-md" />
            ))}
          </div>
        )}
        {!isLoading && showLatest && latestPosts.length > 0 && (
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
        )}{" "}
        {!isLoading && results.length > 0 && (
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-3xl mb-5">Search Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
              {searchResults.map((post) => (
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
                    onClick={() =>
                      setSearchPage((prev) => Math.max(1, prev - 1))
                    }
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
                    onClick={() =>
                      setSearchPage((prev) => Math.min(totalPages, prev + 1))
                    }
                  />
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}{" "}
        {!isLoading && showNoResults && <NoResults />}
      </div>
    </>
  );
}
