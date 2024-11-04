"use client";

import { useState, useEffect } from "react";
import { Button } from "@/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/components/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/avatar";
import { ThumbsUp, MessageCircle } from "lucide-react";
import Link from "next/link";

type LikeActivity = {
  id: number;
  postTitle: string;
  author: string;
  date: string;
  avatar: string;
};

type CommentActivity = {
  id: number;
  postTitle: string;
  author: string;
  date: string;
  avatar: string;
  comment: string;
};

// Simulated API call
const fetchActivities = async (
  type: string,
  page: number
): Promise<LikeActivity[] | CommentActivity[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage;

  if (type === "likes") {
    return [
      {
        id: startIndex + 1,
        postTitle: `The Art of Bonsai: Advanced Techniques (Page ${page})`,
        author: "Jane Doe",
        date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        avatar: "/placeholder.svg?height=40&width=40",
      },
      // Additional like objects can go here
    ];
  } else {
    return [
      {
        id: startIndex + 1,
        postTitle: `The Art of Bonsai: Advanced Techniques (Page ${page})`,
        author: "Jane Doe",
        date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        avatar: "/placeholder.svg?height=40&width=40",
        comment:
          "These advanced techniques are game-changing! I've been struggling with my cascade bonsai, but your tips on wire training have really helped. Thank you!",
      },
      // Additional comment objects can go here
    ];
  }
};

export default function Activity() {
  const [activeTab, setActiveTab] = useState<string>("likes");
  const [likes, setLikes] = useState<LikeActivity[]>([]);
  const [comments, setComments] = useState<CommentActivity[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const loadActivities = async () => {
    setLoading(true);
    const newActivities = await fetchActivities(activeTab, page);
    setLoading(false);

    if (activeTab === "likes") {
      setLikes((prevLikes) => [
        ...prevLikes,
        ...(newActivities as LikeActivity[]),
      ]);
    } else {
      setComments((prevComments) => [
        ...prevComments,
        ...(newActivities as CommentActivity[]),
      ]);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [activeTab, page]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);
    if (value === "likes") {
      setLikes([]);
    } else {
      setComments([]);
    }
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Activity</h1>
          <Tabs defaultValue="likes" className="space-y-4">
            <TabsList>
              <TabsTrigger
                value="likes"
                onClick={() => handleTabChange("likes")}
              >
                Likes
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                onClick={() => handleTabChange("comments")}
              >
                Comments
              </TabsTrigger>
            </TabsList>
            <TabsContent value="likes">
              <Card>
                <CardHeader>
                  <CardTitle>Your Likes</CardTitle>
                  <CardDescription>Posts you've liked recently</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {likes.map((like) => (
                      <li key={like.id} className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={like.avatar} alt={like.author} />
                          <AvatarFallback>
                            {like.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <Link
                            href={`/post/${like.id}`}
                            className="font-medium hover:underline text-rose-600 dark:text-rose-400"
                          >
                            {like.postTitle}
                          </Link>
                          <p className="text-sm">by {like.author}</p>
                          <p className="text-sm">
                            Liked on {new Date(like.date).toLocaleDateString()}
                          </p>
                        </div>
                        <ThumbsUp className="h-5 w-5" />
                      </li>
                    ))}
                  </ul>
                  {loading && <p className="text-center mt-4">Loading...</p>}
                  <div className="mt-4 text-center">
                    <Button onClick={loadMore} disabled={loading}>
                      Load More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle>Your Comments</CardTitle>
                  <CardDescription>Recent comments you've made</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {comments.map((comment) => (
                      <li
                        key={comment.id}
                        className="flex items-start space-x-4"
                      >
                        <Avatar>
                          <AvatarImage
                            src={comment.avatar}
                            alt={comment.author}
                          />
                          <AvatarFallback>
                            {comment.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <Link
                            href={`/post/${comment.id}`}
                            className="font-medium hover:underline text-rose-600 dark:text-rose-400"
                          >
                            {comment.postTitle}
                          </Link>
                          <p className="text-sm">by {comment.author}</p>
                          <p className="text-sm">{comment.comment}</p>
                          <p className="text-sm">
                            Commented on{" "}
                            {new Date(comment.date).toLocaleDateString()}
                          </p>
                        </div>
                        <MessageCircle className="h-5 w-5" />
                      </li>
                    ))}
                  </ul>
                  {loading && <p className="text-center mt-4">Loading...</p>}
                  <div className="mt-4 text-center">
                    <Button onClick={loadMore} disabled={loading}>
                      Load More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
