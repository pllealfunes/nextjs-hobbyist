"use client";

import { useEffect, useState } from "react";
import UserProfile from "@/ui/components/userprofile";
import { Post, Category } from "@/lib/types";
import { getPublishedPosts } from "@/app/server/postActions";
import { useAuth } from "@/contexts/authContext";
import { FileText } from "lucide-react";
import { useParams } from "next/navigation";
import DashboardPosts from "@/ui/components/dashboard-posts";

export default function Profile() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useAuth();
  const params = useParams();
  const isOwnProfile = user?.id === params.id;

  useEffect(() => {
    async function getPosts() {
      if (!params.id) return;
      try {
        const data = await getPublishedPosts(params.id?.toString());

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
      {posts.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
          {posts.map((post) => (
            <DashboardPosts
              key={post.id}
              post={{
                id: post.id,
                title: post.title,
                content: post.content,
                created_at: post.created_at,
                category_id: post.category_id,
                author_id: post.author_id,
                user: {
                  id: post.user?.id,
                  username: post.user?.username,
                },
                profile: {
                  id: post.profile.id,
                  photo: post.profile?.photo,
                },
              }}
              categories={categories}
            />
          ))}
        </section>
      ) : (
        <section className="m-24 text-center">
          <div className="col-span-full flex flex-col items-center justify-center py-24 px-4">
            <div className="flex items-center justify-center w-24 h-24 bg-rose-100 rounded-full mb-6">
              <FileText className="w-11 h-11 text-rose-400" />
            </div>
            <h3 className="text-3xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
              {isOwnProfile ? "No Posts Yet" : "No Posts Found"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">
              {isOwnProfile
                ? "Create a post to see it here!"
                : "This user hasn't posted anything yet!"}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
