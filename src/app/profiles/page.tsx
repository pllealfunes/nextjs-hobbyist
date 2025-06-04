"use client";

import { useEffect, useState } from "react";
import DashboardPosts from "@/ui/components/dashboard-posts";
import UserProfile from "@/ui/components/userprofile";
import { Post, Category } from "@/lib/types";
import { getPublishedPosts } from "@/app/server/postActions";
import { useAuth } from "@/contexts/authContext";
import { FileText } from "lucide-react";

export default function Profile() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    async function getPosts() {
      try {
        const data = await getPublishedPosts();

        const categoriesResponse = await fetch("/api/categories");
        const categoriesData: Category[] = await categoriesResponse.json();

        if (Array.isArray(data)) {
          setPosts(data);
        }

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getPosts();
  }, []);

  return (
    <div>
      <UserProfile post={posts.length} />
      {/* Posts Section */}
      {user &&
      Array.isArray(posts) &&
      posts.some((post) => post.author_id === user.id) ? (
        <section className="mt-14">
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 p-6">
            {posts.map((post) => (
              <DashboardPosts
                key={post.id}
                post={post}
                categories={categories}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="m-32 text-center">
          <div className="col-span-full flex flex-col items-center justify-center py-24 px-4">
            <div className="flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-6">
              <FileText className="w-8 h-8 text-rose-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Posts Found
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Create a post to see it here!
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
