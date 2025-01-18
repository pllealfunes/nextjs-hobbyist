"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/avatar";
import { Button } from "@/ui/components/button";
import {
  InstagramLogoIcon,
  TwitterLogoIcon,
  LinkedInLogoIcon,
  GlobeIcon,
} from "@radix-ui/react-icons";
import { useAuth } from "@/contexts/authContext";

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div>
      <section>
        <div className="py-12 sm:py-20 rounded-3xl flex flex-col justify-center items-center gap-8 px-4 sm:px-10">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-36 h-36 shadow-md">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {user ? (
              <h2 className="text-4xl font-extrabold tracking-tight light:text-gray-900">
                {user.username}
              </h2>
            ) : (
              <h2 className="text-4xl font-extrabold tracking-tight light:text-gray-900">
                Loading...
              </h2>
            )}
          </div>

          {/* Bio */}
          <div className="text-center text-lg light:text-gray-800 max-w-lg">
            Brother. Plumber. Hero. Fear of Ghosts. Loves Green.
          </div>

          {/* Followers, Following, Posts Count */}
          <div className="flex justify-around w-full max-w-md text-center text-sm light:text-gray-900 font-medium">
            <div className="flex flex-col light:hover:text-zinc-50 dark:hover:text-rose-500 cursor-pointer">
              <span className="font-extrabold text-xl">10</span>
              Posts
            </div>
            <div className="flex flex-col light:hover:text-zinc-50 dark:hover:text-rose-500 cursor-pointer">
              <span className="font-extrabold text-xl">120</span>
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
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="light:text-gray-900 light:hover:text-zinc-50 dark:hover:text-rose-500 transition duration-300"
              aria-label="Twitter"
            >
              <TwitterLogoIcon className="h-8 w-8" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="light:text-gray-900 light:hover:text-zinc-50 dark:hover:text-rose-500  transition duration-300"
              aria-label="LinkedIn"
            >
              <LinkedInLogoIcon className="h-8 w-8" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="light:text-gray-900 light:hover:text-zinc-50 dark:hover:text-rose-500  transition duration-300"
              aria-label="Instagram"
            >
              <InstagramLogoIcon className="h-8 w-8" />
            </a>
            <a
              href="https://personalwebsite.com"
              target="_blank"
              rel="noopener noreferrer"
              className="light:text-gray-900 light:hover:text-zinc-50 dark:hover:text-rose-500  transition duration-300"
              aria-label="Website"
            >
              <GlobeIcon className="h-8 w-8" />
            </a>
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

export default UserProfile;
