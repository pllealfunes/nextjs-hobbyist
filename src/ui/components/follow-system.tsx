"use client";

import { useState } from "react";
import { Button } from "@/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/components/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/avatar";
import { Badge } from "@/ui/components/badge";
import { Users, Tag, Search } from "lucide-react";
import { Input } from "@/ui/components/input";

// Mock data
const initialCategories = [
  { id: 1, name: "Technology", isFollowing: true },
  { id: 2, name: "Design", isFollowing: true },
  { id: 3, name: "Photography", isFollowing: false },
  { id: 4, name: "Travel", isFollowing: true },
  { id: 5, name: "Food", isFollowing: false },
  { id: 6, name: "Fitness", isFollowing: true },
];

const initialUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "@sarahj",
    avatar: "/placeholder.svg?height=40&width=40",
    isFollowing: true,
  },
  {
    id: 2,
    name: "Mike Chen",
    username: "@mikec",
    avatar: "/placeholder.svg?height=40&width=40",
    isFollowing: true,
  },
  {
    id: 3,
    name: "Emma Davis",
    username: "@emmad",
    avatar: "/placeholder.svg?height=40&width=40",
    isFollowing: false,
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    username: "@alexr",
    avatar: "/placeholder.svg?height=40&width=40",
    isFollowing: true,
  },
  {
    id: 5,
    name: "Lisa Wang",
    username: "@lisaw",
    avatar: "/placeholder.svg?height=40&width=40",
    isFollowing: false,
  },
  {
    id: 6,
    name: "David Kim",
    username: "@davidk",
    avatar: "/placeholder.svg?height=40&width=40",
    isFollowing: true,
  },
];

export default function FollowSystem() {
  const [categories, setCategories] = useState(initialCategories);
  const [users, setUsers] = useState(initialUsers);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const followingCount =
    categories.filter((cat) => cat.isFollowing).length +
    users.filter((user) => user.isFollowing).length;

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategoryFollow = (categoryId: number) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, isFollowing: !cat.isFollowing } : cat
      )
    );
  };

  const toggleUserFollow = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
  };

  const handleModalChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchQuery("");
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <div className="flex justify-center gap-14">
            <div className="text-center p-2">
              <div className="text-2xl font-bold">127</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <Dialog open={isOpen} onOpenChange={handleModalChange}>
              <DialogTrigger asChild>
                <button className="text-center hover:bg-muted rounded-lg p-2 transition-colors">
                  <div className="text-2xl font-bold">{followingCount}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md dark:[&>button]:text-slate-900">
                <DialogHeader className="text-slate-900">
                  <DialogTitle>Following ({followingCount})</DialogTitle>
                </DialogHeader>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search users and categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Tabs defaultValue="users" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="users"
                      className="flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Users ({filteredUsers.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="categories"
                      className="flex items-center gap-2"
                    >
                      <Tag className="w-4 h-4" />
                      Categories ({filteredCategories.length})
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
                                src={user.avatar || "/placeholder.svg"}
                                alt={user.name}
                              />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
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
