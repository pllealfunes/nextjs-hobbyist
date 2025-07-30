import { useEffect } from "react";
import { useCategoriesQuery } from "@/hooks/categoriesQuery";
import { useCategoryStore } from "@/stores/categoryStore";

export const useInitializeCategoriesStore = () => {
  const { data: fetchedCategories } = useCategoriesQuery();
  const setCategories = useCategoryStore((state) => state.setCategories);
  const categories = useCategoryStore((state) => state.categories);

  useEffect(() => {
    if (fetchedCategories && categories.length === 0) {
      setCategories(fetchedCategories);
    }
  }, [fetchedCategories, categories]);
};
