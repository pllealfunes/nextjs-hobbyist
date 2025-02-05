import Link from "next/link";

interface Category {
  name: string;
}

export default function NoResults({
  category,
  categories,
}: {
  category?: string;
  categories: Category[];
}) {
  // Function to capitalize the first letter of the category name
  const capitalizeFirstLetter = (str?: string) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "This category";
  };

  return (
    <div className="text-center py-12">
      <h2 className="text-3xl font-bold mb-6 capitalize">
        No posts found in {capitalizeFirstLetter(category)}
      </h2>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/category/${cat.name}`}
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-full shadow-md flex items-center gap-2 transition duration-300"
            aria-label={`Explore ${cat.name} category`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
      <p className="m-9 text-xl">
        We couldn't find any posts in this category. Check out some of our other
        categories or come back later!
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
