import { create } from "zustand";

interface LikeState {
  likes: Record<string, { count: number; liked: boolean }>;
  setLike: (postId: string, state: { count: number; liked: boolean }) => void;
}

export const useLikeStore = create<LikeState>((set) => ({
  likes: {},
  setLike: (postId, state) =>
    set((prev) => ({
      likes: { ...prev.likes, [postId]: state },
    })),
}));
