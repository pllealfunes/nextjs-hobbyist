"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardPosts from "@/ui/components/dashboard-posts";
import NoResults from "@/ui/components/no-category";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/select";

interface Post {
  id: string;
  title: string;
  content: string | null;
  category_id: number;
  published: boolean;
  private: boolean;
  author_id: string | null;
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
  const [displayCategory, setDisplayCategory] = useState<string | undefined>(
    undefined
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const capitalizeFirstLetter = (str?: string) => {
    if (!str) return "This category";

    if (str.toLowerCase() === "games+puzzles") {
      return "Games+Puzzles";
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    if (!categoryName) return;

    const fetchData = async () => {
      try {
        console.log("Fetching posts for category:", categoryName);
        setLoading(true); // Start loading before fetching

        const [categoriesResponse, postsResponse] = await Promise.all([
          fetch("/api/categories"),
          fetch(`/api/categories/category?category=${categoryName}`),
        ]);

        const categoriesData: Category[] = await categoriesResponse.json();
        const postsData = await postsResponse.json();

        setCategories(categoriesData);
        setPosts(postsData);
        setDisplayCategory(
          capitalizeFirstLetter(decodeURIComponent(categoryName))
        );
      } catch (error) {
        setError("Error fetching posts");
        console.error(error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchData();
  }, [categoryName]);

  if (loading) return <p>Loading...</p>;
  console.log(error);

  return (
    <div>
      {posts.length > 0 ? (
        <>
          {/* Title Section */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-2">
              {displayCategory}
            </h2>
            <div className="h-1 w-1/4 bg-rose-500 mx-auto mb-6"></div>
            <p className="text-center light:text-gray-600 text-lg mb-6">
              Stay updated with the latest posts and insights from our
              community.
            </p>
          </div>

          {/* Form Section */}
          <div className="mb-6 flex justify-center items-center gap-2">
            <label htmlFor="search" className="sr-only">
              Search posts
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search posts..."
              className="md:w-1/3 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="filter" className="sr-only">
              Filter posts
            </label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category.name}
                    value={category.name.toLowerCase()}
                  >
                    <Link
                      href={`/category/${category.name.toLowerCase()}`}
                      className="w-full block"
                      aria-label={`Explore ${category.name} category`}
                    >
                      {category.name}
                    </Link>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.name.toLowerCase()}`}
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
