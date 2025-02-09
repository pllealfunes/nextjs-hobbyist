"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardPosts from "@/ui/components/dashboard-posts";
import NoResults from "@/ui/components/no-category";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string | null;
  category_id: number;
  published: boolean;
  private: boolean;
  authorId: string | null;
  created_at: Date;
  updated_at: Date;
}

interface Category {
  id: number;
  name: string;
}

const CategoryPage = () => {
  const params = useParams();
  const categoryName = params?.categoryName as string | undefined;
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryName) return;

    const fetchPosts = async () => {
      try {
        console.log("Fetching posts for category:", categoryName);

        const categoriesResponse = await fetch("/api/categories");

        const response = await fetch(
          `/api/categories/category?category=${categoryName}`
        );

        const data = await response.json();
        const categoriesData: Category[] = await categoriesResponse.json();

        setPosts(data);
        setCategories(categoriesData);
      } catch (error) {
        setError("Error fetching posts");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [categoryName]);

  if (loading) return <p>Loading...</p>;
  console.log(error);

  return (
    <div>
      {posts.length > 0 ? (
        <>
          <h2 className="text-3xl font-bold mb-6 capitalize">
            Posts in {categoryName}
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/category/${encodeURIComponent(
                  category.name.toLowerCase()
                )}`}
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-full shadow-md flex items-center gap-2 transition duration-300"
                aria-label={`Explore ${category.name} category`}
              >
                {category.name}
              </Link>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 p-6">
            {posts.map((post) => (
              <DashboardPosts
                key={post.id}
                post={post}
                categories={categories}
              />
            ))}
          </div>
        </>
      ) : (
        <NoResults category={categoryName} categories={categories} />
      )}
    </div>
  );
};

export default CategoryPage;
