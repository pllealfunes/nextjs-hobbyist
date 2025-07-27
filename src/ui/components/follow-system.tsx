"use client";

import { useState, useEffect } from "react";
import { Button } from "@/ui/components/button";
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
import { Users, Tag, Search, X } from "lucide-react";
import { Input } from "@/ui/components/input";
import { toast } from "react-hot-toast";
import { getInitials } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  RemoveCategoryMutation,
  RemoveFollowingMutation,
  RemoveFollowerMutation,
} from "@/hooks/removeFollowerMutation";
import { useFollowStore } from "@/stores/followStore";
import { useUserConnectionsQuery } from "@/hooks/userConnectionsQuery";
import { useCategoriesQuery } from "@/hooks/categoriesQuery";
import { useFollowedCategoriesQuery } from "@/hooks/followedCategoriesQuery";

interface FollowSystemProps {
  post: number;
  profileId: string;
  authUser: string;
}

export default function FollowSystem({
  post,
  profileId,
  authUser,
}: FollowSystemProps) {
  const queryClient = useQueryClient();
  const followedCategories = useFollowStore((state) => state.categories);
  const followersUsers = useFollowStore((state) => state.followers);
  const followingUsers = useFollowStore((state) => state.following);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const {
    removeFollowedCategory,
    removeFollowingFromStore,
    removeFollowerFromStore,
    addCategory,
    addFollowing,
    addFollower,
  } = useFollowStore();

  const unfollowCategoryMutation = RemoveCategoryMutation();
  const unfollowUserMutation = RemoveFollowingMutation();
  const removeFollowerMutation = RemoveFollowerMutation();

  const { data: userConnections } = useUserConnectionsQuery(profileId);
  const { data: categories } = useCategoriesQuery();
  const { data: followedIds } = useFollowedCategoriesQuery();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (categories && userConnections && followedIds) {
      const followedCategories = categories
        .filter((category) => followedIds.includes(category.id))
        .map((category) => ({
          ...category,
          isFollowing: true,
        }));

      useFollowStore.getState().setCategories(followedCategories);

      // Directly update Zustand store with fetched data
      useFollowStore.getState().setFollowers(userConnections.followers);
      useFollowStore.getState().setFollowing(userConnections.following);
    }
  }, [categories, userConnections, followedIds]);

  const toggleCategoryFollow = async (categoryId: number) => {
    const category = followedCategories.find((u) => u.id === categoryId);
    if (!category) return;
    const id = Number(categoryId);

    unfollowCategoryMutation.mutate(id, {
      onSuccess: () => {
        removeFollowedCategory(id);
        toast.success("Unfollowed Category");
        setIsFollowingModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["categories", profileId] });
      },
      onError: (error) => {
        addCategory(category);
        toast.error(`Failed to Unfollow Category: ${error}`);
      },
    });
  };

  const toggleUserFollow = async (userId: number) => {
    const user = followingUsers.find((u) => u.id === userId);

    if (!user) return;

    unfollowUserMutation.mutate(userId.toString(), {
      onSuccess: () => {
        removeFollowingFromStore(userId);
        toast.success("Unfollowed");
        setIsFollowingModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["following", profileId] });
      },
      onError: (error) => {
        addFollowing(user);
        toast.error(`Failed to Unfollow User: ${error}`);
      },
    });
  };

  const handleFollowingModalChange = (open: boolean) => {
    setIsFollowingModalOpen(open);
    if (!open) setSearchQuery("");
  };

  const handleFollowersModalChange = (open: boolean) => {
    setIsFollowersModalOpen(open);
    if (!open) setSearchQuery("");
  };

  const filteredUsers = followingUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFollowerUsers = followersUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = followedCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeFromFollowers = async (followerId: number) => {
    const user = followersUsers.find((u) => u.id === followerId);

    if (!user) return;

    removeFollowerMutation.mutate(followerId.toString(), {
      onSuccess: () => {
        removeFollowerFromStore(followerId);
        toast.success("Follower removed!");
        setIsFollowersModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["followers", profileId] });
      },
      onError: (error) => {
        addFollower(user);
        toast.error(`Failed to remove follower: ${error}`);
      },
    });
  };

  return (
    <div>
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <div className="flex justify-center gap-14">
            <div className="text-center p-2">
              <div className="text-2xl font-bold">{post}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div>
              <Dialog
                open={isFollowingModalOpen}
                onOpenChange={handleFollowingModalChange}
              >
                <DialogTrigger asChild>
                  <button className="text-center hover:bg-muted rounded-lg p-2 transition-colors">
                    <div className="text-2xl font-bold">
                      {followedCategories.length + followingUsers.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Following
                    </div>
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
                                <AvatarImage
                                  src={user.avatar}
                                  alt={user.name}
                                />
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
                              onClick={() => toggleCategoryFollow(category.id)}
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
            </div>

            <div>
              <Dialog
                open={isFollowersModalOpen}
                onOpenChange={handleFollowersModalChange}
              >
                <DialogTrigger asChild>
                  <button className="text-center hover:bg-muted rounded-lg p-2 transition-colors">
                    <div className="text-2xl font-bold">
                      {followersUsers.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Followers
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md dark:[&>button]:text-slate-900">
                  <DialogHeader className="text-slate-900">
                    <DialogTitle>
                      Followers ({followersUsers.length})
                    </DialogTitle>
                    <DialogDescription>
                      View the users that follow you.
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
                    <TabsList className="w-full">
                      <TabsTrigger
                        value="users"
                        className="flex items-center gap-2 w-full"
                      >
                        <Users className="w-4 h-4" />
                        Users ({followersUsers.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="users"
                      className="space-y-4 max-h-96 overflow-y-auto"
                    >
                      {filteredFollowerUsers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No users found</p>
                        </div>
                      ) : (
                        filteredFollowerUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={user.avatar}
                                  alt={user.name}
                                />
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
                            <div className="flex justify-around gap-4">
                              {authUser === profileId && (
                                <Button
                                  variant={
                                    user.isFollowing ? "outline" : "default"
                                  }
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
                              )}
                              {authUser === profileId && (
                                <X
                                  className="text-slate-900 mt-1 cursor-pointer hover:text-rose-500"
                                  onClick={() => removeFromFollowers(user.id)}
                                />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
