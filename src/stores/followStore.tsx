import { create } from "zustand";
import type { CategoryWithFollow, FollowingUser } from "@/lib/types";

interface FollowState {
  categories: CategoryWithFollow[];
  following: FollowingUser[];
  followers: FollowingUser[];
  setCategories: (users: CategoryWithFollow[]) => void;
  setFollowing: (users: FollowingUser[]) => void;
  setFollowers: (users: FollowingUser[]) => void;
  removeFollowedCategory: (id: number) => void;
  removeFollowingFromStore: (id: number) => void;
  removeFollowerFromStore: (id: number) => void;
  addCategory: (category: CategoryWithFollow) => void;
  addFollowing: (user: FollowingUser) => void;
  addFollower: (user: FollowingUser) => void;
}

export const useFollowStore = create<FollowState>((set) => ({
  categories: [],
  following: [],
  followers: [],
  setCategories: (categories) => set({ categories: categories }),
  setFollowing: (users) => set({ following: users }),
  setFollowers: (users) => set({ followers: users }),
  removeFollowedCategory: (id: number) =>
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    })),
  removeFollowingFromStore: (id: number) =>
    set((state) => ({
      following: state.following.filter((u) => u.id !== id),
    })),
  removeFollowerFromStore: (id: number) =>
    set((state) => ({
      followers: state.followers.filter((u) => u.id !== id),
    })),
  addCategory: (category) =>
    set((state) => {
      const exists = state.categories.some((c) => c.id === category.id);
      return exists ? state : { categories: [...state.categories, category] };
    }),
  addFollowing: (user) =>
    set((state) => {
      const exists = state.following.some((u) => u.id === user.id);
      return exists ? state : { following: [...state.following, user] };
    }),

  addFollower: (user) =>
    set((state) => {
      const exists = state.followers.some((u) => u.id === user.id);
      return exists ? state : { followers: [...state.followers, user] };
    }),
}));
