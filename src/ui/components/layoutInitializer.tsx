"use client";

import { useInitializeCategoriesStore } from "@/app/features/category/hooks/initializeCategoryStore";

export function LayoutInitializer() {
  useInitializeCategoriesStore();
  return null;
}
