import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/types";

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      const allCategories: Category[] = await res.json();
      return allCategories;
    },
  });
