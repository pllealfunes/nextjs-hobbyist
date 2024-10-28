"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/ui/components/button";
import { Feather, Bell, Plus, ChevronDown } from "lucide-react";

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

export default function LoginNav() {
  return (
    <header className="bg-rose-400 shadow-md rounded-b-lg">
      <nav className="flex items-center justify-between p-4 sm:p-6 lg:px-8 relative">
        <div className="flex lg:flex-1">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/"
              className="-m-1.5 p-1.5 flex justify-center items-center"
              aria-label="Go to homepage"
            >
              <Feather className="w-7 h-7 text-gray-900" />
            </Link>
          </div>
          <div className="hidden sm:ml-6 md:block">
            <div className="flex">
              <Link
                href="/dashboard"
                aria-label="Go to following page"
                className="text-zinc-50 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <div className="flex justify-center items-center text-zinc-50  hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                    Posts <ChevronDown className="mt-1 w-4 h-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="ml-12">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link href="/drafts" aria-label="Go to following page">
                        Drafts
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/published" aria-label="Go to following page">
                        Published
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/explore"
                aria-label="Go to activity page"
                className="text-zinc-50 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >
                Activity
              </Link>

              <Link
                href="/explore"
                aria-label="Go to activity page"
                className="text-zinc-50 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
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
            <Button className="bg-zinc-50 hover:bg-rose-600 hover:text-zinc-50 text-rose-400 mx-3 p-1 font-semibold">
              <Plus className="w-5 h-5 m-1" />
              <span className="mr-2">New Post</span>
            </Button>
          </Link>

          <Button className="hidden md:block relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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
                    {" "}
                    <Link href="/profiles">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Log out</DropdownMenuItem>
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
                    <p>BobsBurgers</p>
                  </div>
                  <Button className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">View notifications</span>
                    <Bell />
                  </Button>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem>Drafts</DropdownMenuItem>
                  <DropdownMenuItem>Published</DropdownMenuItem>
                  <DropdownMenuItem>Activity</DropdownMenuItem>
                  <DropdownMenuItem>Explore</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
}
