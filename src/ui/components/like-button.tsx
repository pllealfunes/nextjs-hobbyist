import { Heart } from "lucide-react";
import { useLike } from "@/hooks/useLike";

interface LikeButtonProps {
  postId: string;
}

export function LikeButton({ postId }: LikeButtonProps) {
  const { liked, likeCount, toggleLike, isLoading } = useLike(postId);

  if (isLoading) {
    return <span className="text-sm text-gray-500">Loading...</span>;
  }

  return (
    <div
      className="flex items-center gap-1 text-red-500 cursor-pointer"
      onClick={() => toggleLike()}
    >
      <Heart className={liked ? "fill-red-500" : "stroke-red-500"} />
      <span className="text-gray-600 text-sm">{likeCount}</span>
    </div>
  );
}
