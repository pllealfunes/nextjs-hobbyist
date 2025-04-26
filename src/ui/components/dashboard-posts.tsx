import Image from "next/image";
//import { Button } from "./button";
import Link from "next/link";
import { Post, Category } from "@/lib/types";

interface PostCardProps {
  post: Post;
  categories: Category[];
}

function stripHtmlAndTrim(content: string, maxLength: number): string {
  // Remove HTML tags using a regular expression
  const strippedContent = content.replace(/<\/?[^>]+(>|$)/g, "");
  // Trim the content to the specified length
  return strippedContent.length > maxLength
    ? strippedContent.substring(0, maxLength) + "..."
    : strippedContent;
}

export default function DashboardPosts({ post, categories }: PostCardProps) {
  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 cursor-pointer">
      {/* Card Image */}
      {post.coverphoto && post.coverphoto.trim() !== "" && (
        <div className="relative">
          <Image
            src={post.coverphoto}
            alt={post.title}
            width={800}
            height={400}
            className="w-full object-cover rounded-lg"
          />
        </div>
      )}

      {/* Card Content */}
      <div className="p-5">
        {/* Date and Tag */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
          <Link
            href={`/category/${getCategoryName(
              post.category_id
            ).toLowerCase()}`}
            passHref
          >
            <div
              className="bg-rose-600 hover:bg-gray-700 text-white shadow-lg font-bold px-3 py-1 rounded-full text-xs cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              {getCategoryName(post.category_id)}
            </div>
          </Link>
        </div>

        <Link
          href={`/posts/${post.id}/post?category=${encodeURIComponent(
            getCategoryName(post.category_id).toLowerCase()
          )}`}
          passHref
        >
          <div className="block">
            {/* Title */}
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              {post.title}
            </h3>

            {/* Description */}
            <p className="text-gray-700 text-sm mb-6">
              {stripHtmlAndTrim(post.content || "", 100)}
            </p>

            {/* User Info and Like Section */}
            <div className="flex items-center justify-between">
              {/* User Info */}
              <div className="flex items-center gap-3">
                {/* <Image
                  src={post.user_image}
                  alt={post.user_name}
                  height={40}
                  width={40}
                  className="h-10 w-10 rounded-full"
                /> */}
                {/* <p className="text-gray-800 font-semibold">{post.user_name}</p> */}
              </div>

              {/* Like Section */}
              <div className="flex items-center gap-1 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
                <span className="text-gray-600 text-sm">50</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
