"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Footer from "@/ui/components/footer";
import { Button } from "@/ui/components/button";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/avatar";
import { Badge } from "@/ui/components/badge";
import { Card, CardContent } from "@/ui/components/card";
import { Separator } from "@/ui/components/separator";
import { Textarea } from "@/ui/components/textarea";
import {
  Calendar,
  ThumbsUp,
  MessageCircle,
  ChevronLeft,
  Send,
  Trash2,
  Pencil,
} from "lucide-react";
import { Post, Comment } from "@/lib/types";
import DeleteConfirmationDialog from "@/ui/components/deleteConfirmationDialog";
import { deleteSinglePost } from "@/app/posts/actions";
import { useRouter } from "next/navigation";
import {
  getCommentsById,
  // createComment,
  // updateComment,
  // deleteComment,
} from "@/app/server/commentActions";
import { getPostById } from "@/app/server/postActions";
import PostSkeleton from "@/ui/components/postSkeleton";

export default function PostPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "Unknown";
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const router = useRouter();
  const safePostId = typeof id === "string" ? id : "";

  const capitalizeFirstLetter = (str?: string) => {
    if (!str) return "This category";

    if (str.toLowerCase() === "games+puzzles") {
      return "Games+Puzzles";
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const fetchData = useCallback(async () => {
    try {
      if (!safePostId) return;

      const response = await getCommentsById(safePostId);

      if (!response.success) {
        console.warn("Error fetching comments:", response.error);
        setComments([]);
        return;
      }

      setComments(
        response.comments?.map((comment) => ({
          id: comment.id,
          post_id: comment.post_id,
          author_id: comment.author_id,
          comment: comment.comment,
          created_at: comment.created_at,
          updated_at: comment.updated_at,

          // ✅ Restructure `User` + `Profile` data into a single `author` object
          author: {
            id: comment.author_id, // ✅ Fix missing comma issue
            username: comment.User?.[0]?.username || "Anonymous",
            profileImage: comment.Profile?.[0]?.photo || "",
          },
        })) ?? []
      );
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [safePostId]);

  useEffect(() => {
    async function loadPost() {
      if (!safePostId) return;

      const response = await getPostById(safePostId);

      if (!response.success) {
        console.error("Error fetching post:", response.error);
        return;
      }

      setPost(response.post);
      fetchData();
    }

    loadPost();
  }, [safePostId]);

  const onDeleteSuccess = async () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {post ? (
        <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/profiles"
              className="inline-flex items-center hover:text-rose-600 mb-6 transition"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
            <div className="mx-auto w-full flex justify-end gap-4 mb-4">
              <Link href={`/posts/editpost/${post.id}`} passHref>
                <Pencil className="text-rose-400 cursor-pointer w-9 h-9 hover:text-rose-600 transition" />
              </Link>

              <DeleteConfirmationDialog
                trigger={
                  <Trash2 className="text-red-500 cursor-pointer w-9 h-9 hover:text-red-600 transition" />
                }
                onConfirm={() => deleteSinglePost(post.id, onDeleteSuccess)}
              />
            </div>
            <article>
              {post.coverphoto && (
                <Image
                  src={post.coverphoto}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full object-cover rounded-lg"
                />
              )}

              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src="https://randomuser.me/api/portraits/men/2.jpg"
                        alt="Author"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        href="#"
                        className="text-lg font-semibold hover:text-rose-600"
                      >
                        John Doe
                      </Link>
                      <div className="flex items-center text-sm">
                        {post.updated_at &&
                        post.updated_at != post.created_at ? (
                          <>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <time
                                dateTime={new Date(
                                  post.updated_at
                                ).toLocaleDateString()}
                              >
                                {new Date(post.created_at).toLocaleDateString()}
                              </time>
                            </div>
                            <span className="mx-2">•</span>
                            <div>
                              Updated:&nbsp;
                              <time
                                dateTime={new Date(
                                  post.updated_at
                                ).toLocaleDateString()}
                              >
                                {new Date(post.updated_at).toLocaleDateString()}
                              </time>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <time
                              dateTime={new Date(
                                post.updated_at
                              ).toLocaleDateString()}
                            >
                              {new Date(post.created_at).toLocaleDateString()}
                            </time>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs"
                  >
                    <Link href={`/category/${category}`} passHref>
                      {" "}
                      {capitalizeFirstLetter(category)}
                    </Link>
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </article>
            <div className="mt-8 flex justify-end items-center">
              <div className="flex space-x-4">
                <Button>
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  Like
                </Button>
                <Button>
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Comment
                </Button>
              </div>
            </div>
            <Separator className="my-8" />
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-rose-500">
                Leave a Comment
              </h3>
              <div className="bg-white rounded-lg shadow p-4">
                <Textarea
                  placeholder="Write your comment here..."
                  className="mb-4 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex justify-end">
                  <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-rose-500">
                Comments
              </h2>
              <div className="space-y-6">
                {comments?.length > 0 ? (
                  comments.map((comment, index) => (
                    <div
                      key={comment.id || index}
                      className="bg-white rounded-lg shadow p-4"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar>
                          {comment.author.photo ? (
                            <AvatarImage
                              src={comment.author.photo}
                              alt={comment.author.username || "Unknown User"}
                            />
                          ) : (
                            <AvatarFallback>
                              {comment.author.username
                                ? comment.author.username[0]
                                : "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <Link
                            href="#"
                            className="font-semibold text-zinc-900 hover:text-rose-600"
                          >
                            {comment.author.username || "Anonymous"}
                          </Link>
                          <p className="text-sm text-zinc-600">
                            {comment.created_at
                              ? new Date(
                                  comment.created_at
                                ).toLocaleDateString()
                              : "Unknown Date"}
                          </p>
                        </div>
                      </div>
                      <p className="text-zinc-900">
                        {comment.comment || "No content available."}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </div>
            </section>
            <Separator className="my-8" />
            <section>
              <h2 className="text-2xl font-bold mb-4 text-rose-500">
                Related Posts
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    title: "Essential Tools for Bonsai Enthusiasts",
                    excerpt:
                      "Discover the must-have tools for cultivating and maintaining your bonsai trees.",
                    author: "John Smith",
                  },
                  {
                    title: "Seasonal Care for Your Bonsai",
                    excerpt:
                      "Learn how to care for your bonsai throughout the year to ensure its health and beauty.",
                    author: "Emily Chen",
                  },
                ].map((post, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <Link
                        href="#"
                        className="text-rose-400 text-sm font-medium"
                      >
                        <h3 className="text-lg font-semibold mb-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <Link
                          href="#"
                          className="hover:text-rose-600 text-sm font-medium"
                        >
                          {post.author}
                        </Link>
                        <Link
                          href="#"
                          className="hover:text-rose-600 text-sm font-medium"
                        >
                          Read More
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </main>
      ) : (
        <PostSkeleton />
      )}
      <Footer />
    </div>
  );
}
