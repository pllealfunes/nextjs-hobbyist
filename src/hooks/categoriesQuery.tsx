import { useQuery } from "@tanstack/react-query";
import { CategoryWithFollow } from "@/lib/types";

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      const allCategories: CategoryWithFollow[] = await res.json();
      return allCategories;
    },
  });
