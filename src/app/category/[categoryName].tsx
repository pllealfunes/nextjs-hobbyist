import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardPosts from "@/ui/components/dashboard-posts"; // Adjust the import path as needed

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

const CategoryPage = () => {
  const router = useRouter();
  const { categoryName } = router.query;
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Adjust the initial state type

  useEffect(() => {
    console.log("categoryName:", categoryName); // Log the category name
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        setError("Error fetching categories"); // Adjusted error message
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `/api/postsCategory?category=${categoryName}`
        );
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (error) {
        setError("Error fetching posts"); // Adjusted error message
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchPosts();
    }
  }, [categoryName]);

  const getCategoryId = (name: string): number | undefined => {
    const category = categories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase()
    );
    return category ? category.id : undefined;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const categoryId = getCategoryId(categoryName as string);
  if (!categoryId) return <p>Category not found</p>;

  return (
    <div>
      <h1>Posts in {categoryName}</h1>
      <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 p-6">
        {Array.isArray(posts) &&
          posts.map((post) => (
            <DashboardPosts key={post.id} post={post} categories={categories} />
          ))}
      </div>
    </div>
  );
};

export default CategoryPage;
