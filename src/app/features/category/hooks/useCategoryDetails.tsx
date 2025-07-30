import { useEffect, useState } from "react";
import { Post } from "@/lib/types";
import { getCategoryWithPosts } from "@/app/server/categoryActions";
import { fetchFollowState } from "@/app/server/categoryActions";
import { useCategoryStore } from "@/stores/categoryStore";
import { toast } from "react-hot-toast";

export const useCategoryDetails = (categoryName: string | undefined) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = useCategoryStore((state) => state.categories);

  const capitalizeFirstLetter = (str?: string) => {
    if (!str) return "This category";

    if (str.toLowerCase() === "games+puzzles") {
      return "Games+Puzzles";
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    if (!categoryName || typeof categoryName !== "string") return;

    const loadDetails = async () => {
      setIsLoading(true);
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
    setShowNoResults,
    isLoading,
    setIsLoading,
    categories,
  };
};
