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

export default function Profile() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts", error);
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
          {posts.map((post) => (
            <DashboardPosts key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
