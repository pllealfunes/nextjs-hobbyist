import { useMutation } from "@tanstack/react-query";
import {
  getUserConnections,
  toggleFollowUser,
  removeFollower,
} from "@/app/server/followUsersActions";
import {
  toggleFollowCategory,
  getFollowedCategories,
} from "@/app/server/categoryActions";

export const RemoveCategoryMutation = () => {
  return useMutation({
    mutationFn: (categoryId: number) => toggleFollowCategory(categoryId),
  });
};

export const RemoveFollowingMutation = () => {
  return useMutation({
    mutationFn: (followingId: string) => toggleFollowUser(followingId),
  });
};

export const RemoveFollowerMutation = () => {
  return useMutation({
    mutationFn: (followerId: string) => removeFollower(followerId),
  });
};
