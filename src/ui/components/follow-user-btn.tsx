import { Button } from "./button";

interface FollowCategoryButtonProps {
  isFollowing: boolean;
  handleFollow: () => void;
}

const FollowUserBtn = ({
  isFollowing,
  handleFollow,
}: FollowCategoryButtonProps) => {
  return (
    <Button
      onClick={handleFollow}
      className="bg-rose-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowUserBtn;
