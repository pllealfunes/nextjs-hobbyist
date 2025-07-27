"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/avatar";
import { Button } from "@/ui/components/button";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/contexts/authContext";
import { useParams } from "next/navigation";
import { UserProfile } from "@/lib/types";
import FollowSystem from "@/ui/components/follow-system";
import FollowUserBtn from "./follow-user-btn";
import {
  followUserState,
  toggleFollowUser,
} from "@/app/server/followUsersActions";

interface UserProfileProps {
  post: number;
}

const UserProfileDetails = ({ post }: UserProfileProps) => {
  const authUser = useAuth();
  const { id: profileId } = useParams<{ id: string }>();
  const isSelf = authUser.user?.id === profileId;
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!profileId) return;

        const userRes = await fetch(`/api/user/${profileId}`);
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userInfo = await userRes.json();

        const profileRes = await fetch(`/api/profile/${profileId}`);
        if (!profileRes.ok) throw new Error("Failed to fetch profile data");
        const profileInfo = await profileRes.json();

        if (userInfo && profileInfo) {
          const fetchedUserData = {
            id: userInfo.id,
            name: userInfo.name || "",
            username: userInfo.username || "",
            photo: profileInfo.photo || undefined,
            email: userInfo.email || "",
            role: userInfo.role || "USER",
            bio: profileInfo.bio || "",
            links: profileInfo.links || [{ label: "", url: "" }],
          };

          setUserData(fetchedUserData);
          const followStatus = await followUserState(profileId);
          setIsFollowing(followStatus);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (profileId) {
      fetchData();
    }
  }, [profileId]);

  const getUserInitials = (name?: string | null) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const handleFollow = async () => {
    if (!profileId) return;

    try {
      const newFollowState = await toggleFollowUser(profileId);
      setIsFollowing(newFollowState);
    } catch (error) {
      console.error("❌ Error toggling follow state:", error);
    }
  };

  return (
    <div>
      <section>
        <div className="py-12 sm:py-20 flex flex-col justify-center items-center gap-8 px-4 sm:px-10">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-36 h-36">
              <AvatarImage
                src={userData?.photo || undefined}
                alt={getUserInitials(userData?.username)}
              />
              <AvatarFallback className="bg-muted text-7xl">
                {userData ? getUserInitials(userData.username) : "?"}
              </AvatarFallback>
            </Avatar>
            {profileId ? (
              <h2 className="text-4xl font-extrabold tracking-tight light:text-gray-900">
                {userData?.username}
              </h2>
            ) : (
              <h2 className="text-4xl font-extrabold tracking-tight light:text-gray-900">
                Loading...
              </h2>
            )}
          </div>

          {/* Bio */}
          <div className="text-center text-lg light:text-gray-800 max-w-lg">
            {userData?.bio}
          </div>

          {/* Followers, Following, Posts Count */}
          <FollowSystem
            post={post}
            profileId={profileId}
            authUser={authUser?.user?.id ?? ""}
          />

          {/* Social Media Links */}
          {userData &&
            Array.isArray(userData?.links) &&
            userData.links.filter((link) => link?.url?.trim()).length > 0 && (
              <div>
                <div className="flex justify-center items-center flex-row gap-3">
                  {userData.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-rose-900 transition-all duration-300 font-semibold text-lg"
                    >
                      <ExternalLinkIcon className="w-5 h-5" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

          {/* Buttons */}
          <div className="flex justify-center items-center gap-6 mt-6">
            {!isSelf && (
              <FollowUserBtn
                isFollowing={isFollowing}
                handleFollow={handleFollow}
              />
            )}
            <Button className="bg-rose-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105">
              Message
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfileDetails;
