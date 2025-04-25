import Link from "next/link";
import { Category } from "@/lib/types";

export default function NoResults({
  category,
  categories,
}: {
  category?: string;
  categories: Category[];
}) {
  // Ensure category is a string before calling methods
  const categoryName = category ?? "Unknown"; // Fallback if category is undefined

  // Decode and capitalize if category is available
  const decodedCategory = decodeURIComponent(categoryName).toUpperCase();

  return (
    <div className="text-center py-12">
      <h2 className="text-3xl font-bold mb-6 capitalize">
        No posts found in {decodedCategory}
      </h2>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-full shadow-md flex items-center gap-2 transition duration-300"
            aria-label={`Explore ${cat.name.toLowerCase()} category`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
      <p className="m-9 text-xl">
        We couldn&apos;t find any posts in this category. Check out some of our
        other categories or come back later!
      </p>
      <Link
        href="/"
        className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
}
