import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { likePostState, toggleLikePost } from "@/app/server/likeAction";

interface LikeState {
  count: number;
  liked: boolean;
}

export function useLike(postId: string) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["likes", postId],
    queryFn: async () => {
      const result = await likePostState(postId);
      return result;
    },
    enabled: !!postId,
  });

  const mutation = useMutation({
    mutationFn: () => toggleLikePost(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["likes", postId] });

      const previous = queryClient.getQueryData(["likes", postId]);

      queryClient.setQueryData<LikeState>(["likes", postId], (old) => {
        if (!old) return { count: 1, liked: true }; // fallback if no cache

        return {
          count: old.liked ? old.count - 1 : old.count + 1,
          liked: !old.liked,
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["likes", postId], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
    },
  });

  return {
    liked: data?.liked ?? false,
    likeCount: data?.count ?? 0,
    isLoading,
    toggleLike: mutation.mutate,
  };
}
