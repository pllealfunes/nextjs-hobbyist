"use client";

import { useEffect, useState, useCallback } from "react";
import { columns } from "@/ui/components/table-columns";
import { DataTable } from "@/ui/components/data-table";
import PostCalendar from "@/ui/components/calendar";
import { LikesCommentsChart } from "@/ui/components/likescomments-chart";
import { Post, Category } from "@/lib/types";
import { getDraftPosts } from "@/app/server/postActions";

export default function Drafts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const data = await getDraftPosts();
      if (Array.isArray(data)) {
        setPosts(data); // empty array = no posts, still valid
      } else {
        console.warn("Unexpected response structure:", data);
        setPosts([]); // fallback to empty state
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    }

    fetchData();
    loadCategories();
  }, []);

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-evenly items-center gap-4 mb-24 mt-7">
        <div className="md:w-1/2 md:h-1/2 sm:w-auto sm:h-auto">
          <LikesCommentsChart />
        </div>
        <PostCalendar />
      </div>
      <DataTable columns={columns(getCategoryName, fetchData)} data={posts} />
    </div>
  );
}
