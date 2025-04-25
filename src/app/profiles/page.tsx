"use client";

import { useEffect, useState } from "react";
import DashboardPosts from "@/ui/components/dashboard-posts";
import UserProfile from "@/ui/components/userprofile";
import { Post, Category } from "@/lib/types";
import { useAuth } from "@/contexts/authContext";

export default function Profile() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await fetch("/api/posts/published");
        const data = await response.json();

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
          <h2 className="text-3xl">Create A Post To See It Here!</h2>
        </section>
      )}
    </div>
  );
}
