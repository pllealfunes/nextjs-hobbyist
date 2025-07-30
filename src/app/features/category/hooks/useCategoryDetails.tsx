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
import { useCategoryStore } from "@/stores/categoryStore";
import { toast } from "react-hot-toast";

export const useCategoryDetails = (categoryName: string | undefined) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = useCategoryStore((state) => state.categories);

  if (!categoryName || typeof categoryName !== "string") {
    return {
      posts: [],
      isFollowing: false,
      setIsFollowing,
      showNoResults: false,
      isLoading: false,
      categories,
    };
  }

  const capitalizeFirstLetter = (str?: string) => {
    if (!str) return "This category";

    if (str.toLowerCase() === "games+puzzles") {
      return "Games+Puzzles";
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    setIsLoading(true);

    const loadDetails = async () => {
      try {
        const postsData = await getCategoryWithPosts(
          capitalizeFirstLetter(categoryName)
        );

        const normalizeName = (name: string) =>
          decodeURIComponent(name).replace(/\+/g, " ").trim().toLowerCase();

        const matched = categories.find(
          (cat) => normalizeName(cat.name) === normalizeName(categoryName)
        );

        setPosts(postsData.posts ?? []);
        setShowNoResults(postsData.posts?.length === 0);

        if (matched) {
          const followStatus = await fetchFollowState(matched.id);

          setIsFollowing(followStatus);
        }
      } catch (error) {
        toast.error(`Failed to load category details: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetails();
  }, [categoryName, categories]);

  return {
    posts,
    isFollowing,
    setIsFollowing,
    showNoResults,
    isLoading,
    categories,
  };
};
