import { useQuery } from "@tanstack/react-query";
import { getFollowedCategories } from "@/app/server/categoryActions";

export const useFollowedCategoriesQuery = () =>
  useQuery({
    queryKey: ["followedCategoryIds"],
    queryFn: () => getFollowedCategories(),
  });
