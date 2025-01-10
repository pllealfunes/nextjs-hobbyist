"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/ui/components/button";
import { Bell, Plus, ChevronDown, PencilLine } from "lucide-react";
import { signOut } from "@/app/auth/signout/signout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/components/dropdown-menu";
import { ThemeToggle } from "@/ui/theme-toggle";
import clsx from "clsx";
import { useAuth } from "@/contexts/authContext";

export default function LoginNav() {
  const pathname = usePathname();
  const user = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-rose-400 dark:bg-transparent dark:border-b dark:border-gray-600 shadow-md rounded-b-lg">
      <nav className="flex items-center justify-between p-4 sm:p-6 lg:px-8 relative">
        <div className="flex lg:flex-1">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/"
              className="-m-1.5 p-1.5 flex justify-center items-center"
              aria-label="Go to homepage"
            >
              <PencilLine className="w-7 h-7 light:text-gray-900" />
            </Link>
          </div>
          <div className="hidden sm:ml-6 md:block">
            <div className="flex">
              <Link
                href="/dashboard"
                aria-label="Go to dashboard page"
                className={clsx(
                  "text-zinc-50 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium",
                  {
                    "bg-gray-700": pathname === "/dashboard",
                  }
                )}
              >
                Dashboard
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <div
                    className={clsx(
                      "flex justify-center items-center text-zinc-50 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium",
                      {
                        "bg-gray-700": pathname.startsWith("/posts"),
                      }
                    )}
                  >
                    Posts <ChevronDown className="mt-1 w-4 h-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="ml-12">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link
                        href="/posts/drafts"
                        aria-label="Go to drafts page"
                        className={clsx(
                          "flex justify-center items-center px-3 py-2 text-sm font-medium",
                          {
                            "bg-gray-700": pathname === "/posts/drafts",
                          }
                        )}
                      >
                        Drafts
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="/posts/published"
                        aria-label="Go to published page"
                        className={clsx(
                          "flex justify-center items-center px-3 py-2 text-sm font-medium",
                          {
                            "bg-gray-700": pathname === "/posts/published",
                          }
                        )}
                      >
                        Published
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/activity"
                aria-label="Go to activity page"
                className={clsx(
                  "text-zinc-50 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium",
                  {
                    "bg-gray-700": pathname === "/activity",
                  }
                )}
              >
                Activity
              </Link>

              <Link
                href="/feed"
                aria-label="Go to feed page"
                className={clsx(
                  "text-zinc-50 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium",
                  {
                    "bg-gray-700": pathname === "/feed",
                  }
                )}
              >
                Feed
              </Link>

              <Link
                href="/explore"
                aria-label="Go to explore page"
                className={clsx(
                  "text-zinc-50 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium",
                  {
                    "bg-gray-700": pathname === "/explore",
                  }
                )}
              >
                Explore
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Menu */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          {/* Bell Icon - Hidden on small screens */}
          <Link href="/posts/createpost" passHref>
            <Button className="bg-zinc-50 hover:bg-rose-600 hover:text-zinc-50 text-rose-500 mx-3 p-1 font-semibold">
              <Plus className="w-5 h-5 m-1" />
              <span className="mr-2">New Post</span>
            </Button>
          </Link>

          <Button className="hidden md:block relative rounded-full bg-gray-800 p-1 text-zinc-50 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="sr-only">View notifications</span>
            <Bell />
          </Button>

          {/* User Profile - Hidden on small screens */}
          <div className="pr-2 ml-3 hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Image
                  alt="User avatar"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="rounded-full"
                  height={32}
                  width={32}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link href="/profiles" aria-label="Go to profiles page">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/usersettings" aria-label="Go to settings page">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ThemeToggle />

          {/* Mobile Bars Icon - Visible only on small screens */}
          <div className="ml-2 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center gap-2 my-2">
                    <Link href="/profiles">
                      <Image
                        alt="User avatar"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="rounded-full"
                        height={32}
                        width={32}
                      />
                    </Link>
                    <div>
                      {" "}
                      {user ? (
                        <p>Welcome, {user.name || user.username}!</p>
                      ) : (
                        <p>Loading...</p>
                      )}{" "}
                    </div>
                  </div>
                  <Button className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">View notifications</span>
                    <Bell />
                  </Button>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    {" "}
                    <Link href="/dashboard" aria-label="Go to dashboard page">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/drafts" aria-label="Go to drafts page">
                      Drafts
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/posts/published"
                      aria-label="Go to published page"
                    >
                      Published
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/activity" aria-label="Go to following page">
                      Activity
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/feed" aria-label="Go to feed page">
                      Feed
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/posts/drafts" aria-label="Go to drafts page">
                      Explore
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link href="/profiles" aria-label="Go to profile page">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/usersettings" aria-label="Go to settings page">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
}
