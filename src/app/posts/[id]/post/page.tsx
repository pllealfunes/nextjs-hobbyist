"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/ui/components/footer";
import { Button } from "@/ui/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/avatar";
import { Badge } from "@/ui/components/badge";
import { Card, CardContent } from "@/ui/components/card";
import { Separator } from "@/ui/components/separator";
import { Textarea } from "@/ui/components/textarea";
import {
  Calendar,
  Clock,
  ThumbsUp,
  MessageCircle,
  ChevronLeft,
  Send,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  coverphoto: string;
  content: string;
  category_id: number;
  published: boolean;
  private: boolean;
  author_id: string;
  created_at: Date;
  updated_at: Date;
}

export default function PostPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "Unknown";
  const [post, setPost] = useState<Post | null>(null);

  const capitalizeFirstLetter = (str?: string) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "This category";
  };

  useEffect(() => {
    if (id) {
      // Fetch the post data by ID
      fetch(`/api/posts/post?id=${id}`)
        .then((response) => response.json())
        .then((data) => setPost(data))
        .catch((error) => console.error("Error fetching post:", error));
    }
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center hover:text-rose-500 mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <article>
            {post.coverphoto && (
              <Image
                src={post.coverphoto}
                alt="Blog post cover image"
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
                      <Calendar className="h-4 w-4 mr-1" />
                      <time dateTime="2023-05-15">
                        {new Date(post.created_at).toLocaleDateString()}
                      </time>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>8 min read</span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs"
                >
                  {capitalizeFirstLetter(category)}
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
            <h2 className="text-2xl font-bold mb-6 text-rose-500">Comments</h2>
            <div className="space-y-6">
              {[
                {
                  author: "Alice Johnson",
                  avatar: "/placeholder.svg?height=40&width=40",
                  date: "June 1, 2023",
                  content:
                    "Great article! I've been interested in starting bonsai as a hobby, and this guide is really helpful. Do you have any recommendations for good bonsai workshops or classes for beginners?",
                },
                {
                  author: "Bob Smith",
                  avatar: "/placeholder.svg?height=40&width=40",
                  date: "June 2, 2023",
                  content:
                    "I've been practicing bonsai for a few years now, and I can attest to how rewarding it is. One tip I'd add is to join a local bonsai club if possible. It's a great way to learn from experienced practitioners and get hands-on guidance.",
                },
              ].map((comment, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage src={comment.avatar} alt={comment.author} />
                      <AvatarFallback>
                        {comment.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        href="#"
                        className="font-semibold text-zinc-900 hover:text-rose-600"
                      >
                        {comment.author}
                      </Link>
                      <p className="text-sm text-zinc-900">{comment.date}</p>
                    </div>
                  </div>
                  <p className="text-zinc-900">{comment.content}</p>
                </div>
              ))}
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
      <Footer />
    </div>
  );
}
