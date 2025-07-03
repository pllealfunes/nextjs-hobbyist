"use client";

import { useEffect, useState } from "react";
import UserProfile from "@/ui/components/userprofile";
import { Category } from "@/lib/types";
import { getPublishedPosts } from "@/app/server/postActions";
import { useAuth } from "@/contexts/authContext";
import { FileText } from "lucide-react";
import { useParams } from "next/navigation";

interface Post {
  id: number;
  title: string;
  content: string;
  category_id: number;
  created_at: string;
  coverphoto?: string;
  author_id: string;
  user: {
    id: string;
    username: string;
  };
  profile: {
    id: string;
    photo: string | null;
  };
}

export default function Profile() {
  const [posts, setPosts] = useState<Post[]>([]);
  //const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useAuth();
  const params = useParams();
  const isOwnProfile = user?.id === params.id;
  const userPosts = posts.filter((post: Post) => post.author_id === params.id);

  useEffect(() => {
    async function getPosts() {
      try {
        const data = await getPublishedPosts();

        // const categoriesResponse = await fetch("/api/categories");
        // const categoriesData: Category[] = await categoriesResponse.json();

        if (Array.isArray(data)) {
          setPosts(data);
        }

        // if (Array.isArray(categoriesData)) {
        //   setCategories(categoriesData);
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getPosts();
  }, []);
  return (
    <div>
      <UserProfile post={userPosts.length} />
      {userPosts.length > 0 ? (
        <section className="mt-14">{/* posts grid */}</section>
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
