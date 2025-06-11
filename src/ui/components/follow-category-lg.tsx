import { Plus, Minus } from "lucide-react";

interface FollowCategoryButtonProps {
  isFollowing: boolean;
  handleFollow: () => void;
}

const FollowCategoryLg = ({
  isFollowing,
  handleFollow,
}: FollowCategoryButtonProps) => {
  return (
    <button
      onClick={handleFollow}
      className="mb-1 bg-rose-500 text-slate-100 rounded-full w-7 h-7 flex items-center justify-center transition duration-200 hover:bg-rose-600"
    >
      {isFollowing ? (
        <Minus className="w-6 h-6" />
      ) : (
        <Plus className="w-6 h-6" />
      )}
    </button>
  );
};

export default FollowCategoryLg;
