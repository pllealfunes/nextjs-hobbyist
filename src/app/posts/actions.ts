import { toast } from "react-hot-toast";
import { deletePost } from "@/app/server/postActions";

export const deleteSinglePost = async (
  postId: string,
  onSuccess?: () => void
) => {
  await toast.promise(
    async () => {
      const deletedPost = await deletePost(postId);

      if (!deletedPost.success) {
        throw new Error(deletedPost.error || "Failed to delete post");
      }

      if (onSuccess) {
        onSuccess();
      }
    },
    {
      loading: "Deleting post...",
      success: "Post deleted successfully!",
      error: (err) => `Something went wrong: ${err.toString()}`,
    }
  );
};
