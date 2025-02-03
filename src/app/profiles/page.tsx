"use client";

import { useEffect, useState } from "react";
import DashboardPosts from "@/ui/components/dashboard-posts";
import UserProfile from "@/ui/components/userprofile";

interface Post {
  id: string;
  title: string;
  content: string | null;
  categoryId: number;
  published: boolean;
  private: boolean;
  authorId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: number;
  name: string;
}

export default function Profile() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();

        const categoriesResponse = await fetch("/api/categories");
        const categoriesData: Category[] = await categoriesResponse.json();

        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Data is not an array:", data);
        }

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          console.error("Data is not an array:", categoriesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getPosts();
  }, []);

  return (
    <div>
      <UserProfile />
      {/* Posts Section */}
      <section className="mt-14">
        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 p-6">
          {Array.isArray(posts) &&
            posts.map((post) => (
              <DashboardPosts
                key={post.id}
                post={post}
                categories={categories}
              />
            ))}
        </div>
      </section>
    </div>
  );
}
