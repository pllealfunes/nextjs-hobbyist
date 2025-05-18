import { toast } from "react-hot-toast";

export const deletePost = async (postId: string, onSuccess?: () => void) => {
  await toast.promise(
    async () => {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to delete post");
      }

      onSuccess?.();
    },
    {
      loading: "Deleting post...",
      success: "Post deleted successfully!",
      error: (err) =>
        `Something went wrong while deleting the post: ${err.toString()}`,
    }
  );
};
