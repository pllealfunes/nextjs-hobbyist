"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/avatar";
import { Button } from "@/ui/components/button";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/contexts/authContext";
import { Post, UserProfile } from "@/lib/types";
import { getFollowedCategories } from "@/app/server/categoryActions";

interface UserProfileProps {
  post: number;
}

const UserProfileDetails = ({ post }: UserProfileProps) => {
  const user = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [followedCategories, setFollowedCategories] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = user.user?.id;
      if (!userId) return;

      try {
        const userRes = await fetch("/api/user");
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userInfo = await userRes.json();

        const profileRes = await fetch("/api/profile");
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
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchFollowedCategories = async () => {
      if (user) {
        const categories = await getFollowedCategories();
        setFollowedCategories(categories);
      }
    };

    fetchData();
    fetchFollowedCategories();
  }, [user]);

  const getUserInitials = (name?: string | null) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <div>
      <section>
        <div className="py-12 sm:py-20 rounded-3xl flex flex-col justify-center items-center gap-8 px-4 sm:px-10">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-36 h-36">
              <AvatarImage
                src={userData?.photo || undefined}
                alt={getUserInitials(userData?.username)}
              />
              <AvatarFallback className="text-7xl">
                {userData ? getUserInitials(userData.username) : "?"}
              </AvatarFallback>
            </Avatar>
            {user ? (
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
          <div className="flex justify-around w-full max-w-md text-center text-sm light:text-gray-900 font-medium">
            <div className="flex flex-col light:hover:text-zinc-50 dark:hover:text-rose-500 cursor-pointer">
              <span className="font-extrabold text-xl">{post}</span>
              Posts
            </div>
            <div className="flex flex-col light:hover:text-zinc-50 dark:hover:text-rose-500 cursor-pointer">
              <span className="font-extrabold text-xl">
                {followedCategories.length}
              </span>
              Following
            </div>
            <div className="flex flex-col light:hover:text-zinc-50 dark:hover:text-rose-500 cursor-pointer">
              <span className="font-extrabold text-xl">300</span>
              Followers
            </div>
            <div className="flex flex-col light:hover:text-zinc-50 dark:hover:text-rose-500 cursor-pointer">
              <span className="font-extrabold text-xl">7</span>
              Categories
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex gap-4 mt-6">
            <div className="space-y-3 mt-4">
              {userData?.links?.map((link, index) => (
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

          {/* Buttons */}
          <div className="flex gap-6 mt-6">
            <Button className="bg-rose-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105">
              Follow
            </Button>
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
