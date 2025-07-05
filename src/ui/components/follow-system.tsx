"use client";

import { useState, useEffect } from "react";
import { Button } from "@/ui/components/button";
import { Category, FollowingUser, CategoryWithFollow } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/ui/components/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/components/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/avatar";
import { Badge } from "@/ui/components/badge";
import { Users, Tag, Search } from "lucide-react";
import { Input } from "@/ui/components/input";
import {
  toggleFollowCategory,
  getFollowedCategories,
} from "@/app/server/categoryActions";
import { toast } from "react-hot-toast";
import {
  getFollowingUsers,
  toggleFollowUser,
} from "@/app/server/followUsersActions";
import { getInitials } from "@/lib/utils";

interface FollowSystemProps {
  post: number;
  profileId: string;
}

export default function FollowSystem({ post, profileId }: FollowSystemProps) {
  const [followedCategories, setFollowedCategories] = useState<
    CategoryWithFollow[]
  >([]);
  const [followingUsers, setFollowingUsers] = useState<FollowingUser[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // setIsLoading(true);
      try {
        const categoriesRes = await fetch("/api/categories");
        const allCategories: Category[] = await categoriesRes.json();

        const followedUsers = await getFollowingUsers(profileId);

        const followedIds = await getFollowedCategories();

        // Filter only followed categories
        const followedCategories: CategoryWithFollow[] = allCategories
          .filter((category) => followedIds.includes(category.id))
          .map((category) => ({
            ...category,
            isFollowing: true,
          }));

        setFollowedCategories(followedCategories);
        setFollowingUsers(followedUsers);
      } catch (error) {
        console.error("Error loading followed categories", error);
      } finally {
        //setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCategoryFollow = async (category: Category) => {
    // Optimistically remove the category from state
    setFollowedCategories((prev) =>
      prev.filter((cat) => cat.id !== category.id)
    );

    try {
      const updatedStatus = await toast.promise(
        toggleFollowCategory(category.id),
        {
          loading: `Unfollowing ${category.name}`,
          success: `Successfully Unfollowed ${category.name}`,
          error: "Something went wrong. Try again?",
        }
      );

      // If somehow it failed to unfollow, re-add it
      if (!updatedStatus) return;
    } catch (error) {
      // Revert by adding the category back if unfollow failed
      setFollowedCategories((prev) => [
        ...prev,
        { ...category, isFollowing: true },
      ]);
      toast.error(`Something went wrong: ${error}. Try again?`);
    }
  };

  const toggleUserFollow = async (userId: number) => {
    const user = followingUsers.find((u) => u.id === userId);
    if (!user) return;

    // Optimistically remove the user from state
    setFollowingUsers((prev) => prev.filter((u) => u.id !== userId));

    try {
      const updatedStatus = await toast.promise(
        toggleFollowUser(userId.toString()),
        {
          loading: user.isFollowing ? "Unfollowing..." : "Following...",
          success: user.isFollowing ? "Unfollowed" : "Followed",
          error: "Something went wrong. Try again?",
        }
      );

      setFollowingUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isFollowing: updatedStatus } : u
        )
      );
    } catch (error) {
      toast.error(`Failed to update follow status: ${error}`);
    }
  };

  const handleModalChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchQuery("");
    }
  };

  const filteredUsers = followingUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = followedCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <div className="flex justify-center gap-14">
            <div className="text-center p-2">
              <div className="text-2xl font-bold">{post}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <Dialog open={isOpen} onOpenChange={handleModalChange}>
              <DialogTrigger asChild>
                <button className="text-center hover:bg-muted rounded-lg p-2 transition-colors">
                  <div className="text-2xl font-bold">
                    {followedCategories.length + followingUsers.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md dark:[&>button]:text-slate-900">
                <DialogHeader className="text-slate-900">
                  <DialogTitle>
                    Following ({followedCategories.length})
                  </DialogTitle>
                  <DialogDescription>
                    View the users and categories you follow.
                  </DialogDescription>
                </DialogHeader>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 text-muted-foreground transform -translate-y-1/2  w-4 h-4" />
                  <Input
                    placeholder="Search users and categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-slate-900"
                  />
                </div>

                <Tabs defaultValue="users" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="users"
                      className="flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Users ({followingUsers.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="categories"
                      className="flex items-center gap-2"
                    >
                      <Tag className="w-4 h-4" />
                      Categories ({followedCategories.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="users"
                    className="space-y-4 max-h-96 overflow-y-auto"
                  >
                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No users found</p>
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-slate-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {user.username}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant={user.isFollowing ? "outline" : "default"}
                            size="sm"
                            onClick={() => toggleUserFollow(user.id)}
                            className={
                              user.isFollowing
                                ? "hover:bg-destructive hover:text-destructive-foreground"
                                : ""
                            }
                          >
                            {user.isFollowing ? "Unfollow" : "Follow"}
                          </Button>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent
                    value="categories"
                    className="space-y-4 max-h-96 overflow-y-auto"
                  >
                    {filteredCategories.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No categories found</p>
                      </div>
                    ) : (
                      filteredCategories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Tag className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">
                                {category.name}
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                Category
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant={
                              category.isFollowing ? "outline" : "default"
                            }
                            size="sm"
                            onClick={() => toggleCategoryFollow(category)}
                            className={
                              category.isFollowing
                                ? "hover:bg-destructive hover:text-destructive-foreground"
                                : ""
                            }
                          >
                            {category.isFollowing ? "Unfollow" : "Follow"}
                          </Button>
                        </div>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            <div className="text-center p-2">
              <div className="text-2xl font-bold">1.2k</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
