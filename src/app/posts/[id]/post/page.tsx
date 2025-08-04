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
import { CreateCommentSchema } from "@/app/schemas";
import DeleteConfirmationDialog from "@/ui/components/deleteConfirmationDialog";
import { deleteSinglePost } from "@/app/posts/actions";
import { useRouter } from "next/navigation";
import {
  getCommentsById,
  createComment,
  updateComment,
  deleteComment,
} from "@/app/server/commentActions";
import PostSkeleton from "@/ui/components/postSkeleton";
import { toast } from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FollowCategorySm from "@/ui/components/follow-category-sm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/form";
import DeleteCommentConfirmation from "@/ui/components/deleteCommentConfirmation";
import { useFollowStore } from "@/stores/followStore";
import { useCategoryDetails } from "@/app/features/category/hooks/useCategoryDetails";
import { useQueryClient } from "@tanstack/react-query";
import { useRemoveCategoryMutation } from "@/hooks/removeFollowerMutation";
import { useAuth } from "@/contexts/authContext";

export default function PostPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const user = useAuth();
  const category = searchParams.get("category") || "Unknown";
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();
  const safePostId = typeof id === "string" ? id : "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const removeCategoryMutation = useRemoveCategoryMutation();
  const { removeFollowedCategory, addCategory } = useFollowStore();

  const { posts, isFollowing, setIsFollowing, isLoading, categories } =
    useCategoryDetails(category);

  const capitalizeFirstLetter = (str?: string) => {
    if (!str) return "This category";

    if (str.toLowerCase() === "games+puzzles") {
      return "Games+Puzzles";
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const fetchComments = useCallback(async () => {
    if (!safePostId) return;

    try {
      const response = await getCommentsById(safePostId);

      if (!response.success || !Array.isArray(response.comments)) {
        toast.error(`Error fetching comments ${response.error}`);
        setComments([]);
        return;
      }

      const formattedComments = response.comments.map((comment) => ({
        id: comment.id,
        post_id: comment.post_id,
        author_id: comment.author_id,
        comment: comment.content,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        author: {
          id: comment.author_id,
          username: comment.user?.username || "Unknown",
          profileImage: comment.profile?.photo || null,
        },
      }));

      setComments(formattedComments);
    } catch (error) {
      toast.error(`Error fetching comments ${error}`);
    }
  }, [safePostId]);

  useEffect(() => {
    if (isLoading) return;
    if (!posts || posts.length === 0) return;

    const loadPost = async () => {
      if (!safePostId) return;

      try {
        const matchedPost = posts.find((post) => post.id === safePostId);

        if (!matchedPost) {
          toast.error("Post not found matching post category");
          return;
        }

        setPost(matchedPost); // Now sets correctly
        await fetchComments();
      } catch (error) {
        toast.error(`Error loading post ${error}`);
      }
    };

    loadPost();
  }, [safePostId, posts, isLoading]);

  const getUserInitials = (name?: string | null) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const onDeleteSuccess = async () => {
    router.push("/dashboard");
  };

  const form = useForm<z.infer<typeof CreateCommentSchema>>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const editForm = useForm<z.infer<typeof CreateCommentSchema>>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof CreateCommentSchema>> = async (
    data
  ) => {
    setIsSubmitting(true);

    const submitComment = async () => {
      if (!post?.id) {
        toast.error("Post ID is missing. Cannot create a comment.");
        return;
      }

      const formData = {
        content: data.content,
        postId: post?.id ?? "",
      };

      const comment = await createComment(formData);

      if (!comment.success) {
        toast.error(`Failed to create comment: ${comment.error}`);
      }

      return comment;
    };

    form.reset();

    await toast.promise(submitComment(), {
      loading: "Creating Comment...",
      success: "Comment Created Successfully!",
      error: (err) =>
        `Something went wrong while creating the comment: ${err.message}`,
    });
    setIsSubmitting(false);
    fetchComments();
  };

  const handleEditClick = (commentId: string, currentContent: string) => {
    setEditingId(commentId);
    editForm.reset({ content: currentContent });
  };

  const handleSaveEdit: SubmitHandler<
    z.infer<typeof CreateCommentSchema>
  > = async (data) => {
    const submitComment = async () => {
      if (!post?.id) {
        toast.error("Post ID is missing. Cannot create a comment.");
        return;
      }

      const editedComment = await updateComment(
        post?.id ?? "",
        editingId ?? "",
        data.content
      );

      if (!editedComment.success) {
        toast.error(`Failed to create comment: ${editedComment.error}`);
      }

      return editedComment;
    };

    setEditingId(null);

    await toast.promise(submitComment(), {
      loading: "Updating Comment...",
      success: "Comment Updated Successfully!",
      error: (err) =>
        `Something went wrong while updating the comment: ${err.message}`,
    });

    fetchComments();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteComment = async (commentId: string) => {
    await toast.promise(
      (async () => {
        const deletedComment = await deleteComment(commentId);

        if (!deletedComment?.success) {
          toast.error(`Failed to delete comment: ${deletedComment?.error}`);
        }

        return deletedComment;
      })(),
      {
        loading: "Deleting Comment...",
        success: "Comment Deleted Successfully!",
        error: (err) =>
          `Something went wrong while deleting the comment: ${err.message}`,
      }
    );

    // Refresh comments after successful deletion
    fetchComments(); // Ensure this updates the UI with fresh data
  };

  const handleFollow = async () => {
    if (!category) return;

    const currentCategory = categories.find(
      (cat) => cat.name.toLowerCase() === category
    );

    if (!currentCategory) {
      toast.error("Cannot Find Category to Follow or Unfollow");
      return;
    }

    try {
      removeCategoryMutation.mutate(currentCategory.id, {
        onSuccess: () => {
          removeFollowedCategory(currentCategory.id);
          setIsFollowing((prev) => !prev);
          toast.success(
            `${isFollowing ? "Unfollowed" : "Followed"} ${
              currentCategory.name
            } Category`
          );
          queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error) => {
          addCategory(currentCategory);
          toast.error(`Failed to Unfollow Category: ${error}`);
        },
      });
    } catch (error) {
      toast.error(`Error toggling category follow state ${error}`);
    }
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
              Back
            </Link>
            {user.user?.username === post.author_id && (
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
            )}
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
                    {/* User Info */}
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={post?.profile?.photo || undefined}
                        alt={getUserInitials(post?.user?.username)}
                      />
                      <AvatarFallback>
                        {post ? getUserInitials(post?.user?.username) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {post?.user?.username ? (
                        <Link
                          href={`/profiles/${post.user.id}`}
                          className="text-lg hover:text-rose-600 font-semibold hover:underline"
                        >
                          {post.user?.username}
                        </Link>
                      ) : (
                        <p className="text-gray-800 font-semibold">
                          Loading...
                        </p>
                      )}
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
                                post.created_at
                              ).toLocaleDateString()}
                            >
                              {new Date(post.created_at).toLocaleDateString()}
                            </time>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs"
                    >
                      <Link href={`/category/${category}`} passHref>
                        {capitalizeFirstLetter(category)}
                      </Link>
                    </Badge>
                    <FollowCategorySm
                      isFollowing={isFollowing}
                      handleFollow={handleFollow}
                    />
                  </div>
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
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="hidden">Comment:</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={5}
                              placeholder="Write your comment here..."
                              className="mb-4 border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button
                        className="bg-rose-500 hover:bg-rose-600 text-white"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Submitting..."
                        ) : (
                          <>
                            {" "}
                            <Send className="h-4 w-4 mr-2" /> Comment{" "}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-rose-500">
                Comments
              </h2>
              <div className="space-y-6">
                {comments && comments.length > 0 ? (
                  (comments || []).map((comment, index) => (
                    <div
                      key={comment.id || index}
                      className="bg-white rounded-lg shadow p-4"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar>
                          {comment.author?.photo ? (
                            <AvatarImage
                              src={comment.author.photo}
                              alt={
                                comment.author?.username ||
                                getUserInitials(comment.author?.username || "?")
                              }
                            />
                          ) : (
                            <AvatarFallback>
                              {comment.author?.username
                                ? getUserInitials(comment.author?.username)
                                : "?"}
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
                              : new Date(
                                  comment.created_at
                                ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div>
                        {editingId === comment.id ? (
                          <>
                            <Form {...editForm}>
                              <form
                                onSubmit={editForm.handleSubmit(handleSaveEdit)}
                                className="space-y-4"
                              >
                                <FormField
                                  control={editForm.control}
                                  name="content"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="hidden">
                                        Comment:
                                      </FormLabel>
                                      <FormControl>
                                        <Textarea
                                          {...field}
                                          rows={5}
                                          placeholder="Write your comment here..."
                                          className="mb-4 border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="flex justify-end gap-2">
                                  <Button
                                    className="bg-rose-500 hover:bg-rose-600 text-white"
                                    type="submit"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    onClick={handleCancelEdit}
                                    variant="outline"
                                    className="border-zinc-300 hover:bg-slate-500"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </form>
                            </Form>
                          </>
                        ) : (
                          <div>
                            <p className="text-zinc-900">{comment.comment}</p>
                            {user.user?.id === comment.author_id && (
                              <div className="flex justify-end gap-2">
                                <Pencil
                                  onClick={() =>
                                    handleEditClick(comment.id, comment.comment)
                                  }
                                  className="text-rose-400 cursor-pointer w-7 h-7 hover:text-rose-600 transition"
                                />
                                <DeleteCommentConfirmation
                                  onConfirm={handleDeleteComment}
                                  commentId={comment.id}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
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
