import Image from "next/image";
import Link from "next/link";
import { Post, Category } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/avatar";
import { Heart } from "lucide-react";
import { useCategoriesQuery } from "@/hooks/categoriesQuery";

interface PostCardProps {
  post: Post;
}

function stripHtmlAndTrim(content: string, maxLength: number): string {
  // Remove HTML tags using a regular expression
  const strippedContent = content.replace(/<\/?[^>]+(>|$)/g, "");
  // Trim the content to the specified length
  return strippedContent.length > maxLength
    ? strippedContent.substring(0, maxLength) + "..."
    : strippedContent;
}

export default function DashboardPosts({ post }: PostCardProps) {
  const { data: categories } = useCategoriesQuery();

  const getUserInitials = (name?: string | null) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories?.find((cat) => cat.id === categoryId);

    return category ? category.name : "Unknown";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300">
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

        <div className="cardInfo">
          {/* Title */}
          <Link
            href={`/posts/${post.id}/post?category=${encodeURIComponent(
              getCategoryName(post.category_id).toLowerCase()
            )}`}
            passHref
          >
            <h3 className="font-semibold text-xl text-gray-900 hover:underline mb-3">
              {post.title}
            </h3>
          </Link>
          {/* Description */}
          <p className="text-gray-700 text-sm mb-6">
            {stripHtmlAndTrim(post.content || "", 100)}
          </p>

          {/* User Info and Like Section */}
          <div className="flex items-center justify-between">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={post?.profile?.photo || undefined}
                  alt={getUserInitials(post?.user?.username)}
                />
                <AvatarFallback>
                  {post ? getUserInitials(post?.user?.username) : "?"}
                </AvatarFallback>
              </Avatar>
              {post?.user?.username ? (
                <Link
                  href={`/profiles/${post.user.id}`}
                  className="text-gray-800 font-semibold hover:underline"
                >
                  {post.user?.username}
                </Link>
              ) : (
                <p className="text-gray-800 font-semibold">Loading...</p>
              )}
            </div>

            {/* Like Section */}
            <div className="flex items-center gap-1 text-red-500">
              <Heart className="test-rose-500" />
              <span className="text-gray-600 text-sm">50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
