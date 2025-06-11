import { Plus, Minus } from "lucide-react";
//import { useState } from "react";

interface FollowCategoryButtonProps {
  isFollowing: boolean;
  handleFollow: () => void;
}

const FollowCategorySm = ({
  isFollowing,
  handleFollow,
}: FollowCategoryButtonProps) => {
  return (
    <button
      onClick={handleFollow}
      className="bg-rose-500 text-slate-100 rounded-full w-6 h-6 flex items-center justify-center"
    >
      {isFollowing ? (
        <Minus className="w-4 h-4" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
    </button>
  );
};

export default FollowCategorySm;
