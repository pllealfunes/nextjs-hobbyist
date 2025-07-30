import { create } from "zustand";
import { CategoryWithFollow } from "@/lib/types";

interface CategoryState {
  categories: CategoryWithFollow[];
  setCategories: (categories: CategoryWithFollow[]) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
}));
