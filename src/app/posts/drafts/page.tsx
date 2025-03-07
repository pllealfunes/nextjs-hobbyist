"use client";

import { useEffect, useState } from "react";
import { Post, Category, columns } from "@/ui/components/table-columns";
import { DataTable } from "@/ui/components/data-table";
import PostCalendar from "@/ui/components/calendar";
import { LikesCommentsChart } from "@/ui/components/likescomments-chart";

export default function Drafts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/posts/drafts");
        const data = await response.json();

        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

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
      <DataTable columns={columns(getCategoryName)} data={posts} />
    </div>
  );
}
