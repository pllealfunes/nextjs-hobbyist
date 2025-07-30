import { useQuery } from "@tanstack/react-query";
import { getFollowedCategories } from "@/app/server/categoryActions";

export const useFollowedCategoriesQuery = (profileId: string) =>
  useQuery({
    queryKey: ["followedCategoryIds", profileId],
    queryFn: () => getFollowedCategories(profileId),
  });
