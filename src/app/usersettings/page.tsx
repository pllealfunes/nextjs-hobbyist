"use client";

import { useState, useEffect } from "react";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";
import { Textarea } from "@/ui/components/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/components/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/avatar";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  useWatch,
} from "react-hook-form";
import { useAuth } from "@/contexts/authContext";
import { supabase } from "@/lib/supabaseClient";
import { UserProfile } from "@/lib/types";
import { ProfileDetailsSchema, AvatarSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; // Import zod
import PhotoUploader from "@/ui/components/photo-uploader";
import Image from "next/image";
import { Skeleton } from "@/ui/components/skeleton";
import { toast } from "react-hot-toast";
import {
  fileToBase64,
  avatarToCloudinary,
  deleteImageFromCloudinary,
} from "@/utils/postHandler";

// Define the type for form data
type AvatarData = z.infer<typeof AvatarSchema>;
type ProfileData = z.infer<typeof ProfileDetailsSchema>;

export default function UserSettings() {
  const user = useAuth();

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [avatarPhoto, setAvatarPhoto] = useState(userData?.photo || "");
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const userId = user.user?.id;

      if (!userId) return;

      // Fetch user data
      const userRes = await fetch("/api/user");

      if (!userRes.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userInfo = await userRes.json();

      // Fetch profile data
      const profileRes = await fetch("/api/profile");

      if (!profileRes.ok) {
        throw new Error("Failed to fetch user data");
      }

      const profileInfo = await profileRes.json();

      if (userInfo && profileInfo) {
        setUserData({
          id: userInfo.id,
          name: userInfo.name || "",
          username: userInfo.username || "",
          email: userInfo.email || "",
          role: userInfo.role || "USER",
          bio: profileInfo.bio || "",
          links: profileInfo.links || [],
        });
        setAvatarPhoto(profileInfo.photo || "");
      }
    };

    fetchData();
  }, [user]);

  const avatarForm = useForm<AvatarData>({
    mode: "onTouched",
    resolver: zodResolver(AvatarSchema),
    defaultValues: {
      photo: undefined,
    },
  });

  const watchedPhoto = useWatch({
    control: avatarForm.control,
    name: "photo",
  });

  const profileForm = useForm<ProfileData>({
    mode: "onTouched",
    resolver: zodResolver(ProfileDetailsSchema),
    defaultValues: {
      name: "",
      bio: "",
      links: [{ label: "", url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: profileForm.control,
    name: "links",
  });

  const getUserInitials = (name?: string | null) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const handleDeleteAvatarPhoto = async () => {
    try {
      setAvatarPhoto("");
      setIsDeleted(true);
      avatarForm.setValue("photo", undefined);
    } catch (error) {
      console.error("Error deleting avatar photo:", error);
    }
  };

  const uploadAvatar: SubmitHandler<AvatarData> = async (data) => {
    try {
      if (!userData) throw new Error("User data not loaded.");

      const finalPayload: Partial<UserProfile> = {};

      await toast.promise(
        (async () => {
          if (isDeleted && avatarPhoto && !data.photo) {
            await deleteImageFromCloudinary(avatarPhoto);
          }

          let photoUrl: string | null = null;

          if (data.photo instanceof File) {
            const base64 = await fileToBase64(data.photo);
            photoUrl = await avatarToCloudinary(base64, userData);
          } else if (
            typeof data.photo === "string" &&
            data.photo === avatarPhoto
          ) {
            photoUrl = avatarPhoto;
          }

          if (isDeleted && !data.photo && avatarPhoto) {
            finalPayload.photo = undefined;
          } else if (photoUrl) {
            finalPayload.photo = photoUrl;
          }

          const finalResponse = await fetch(`/api/profile/${userData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalPayload),
          });

          if (!finalResponse.ok) {
            throw new Error("Failed to update user avatar.");
          }
        })(),
        {
          loading: "Saving changes...",
          success: "Avatar saved successfully!",
          error: (err) => `Something went wrong: ${err.toString()}`,
        }
      );
    } catch (err) {
      console.error("Upload avatar error:", err);
    }
  };
  const updateProfile: SubmitHandler<ProfileData> = (data) => {
    console.log("Submitted data:", data);
    // Send data to Supabase to update the profile
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 dark:text-zinc-50">
            User Settings
          </h1>

          {userData ? (
            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile details here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage
                        src={
                          avatarPhoto || "/placeholder.svg?height=80&width=80"
                        }
                        alt={getUserInitials(user?.user?.name)}
                      />
                      <AvatarFallback>
                        {user ? getUserInitials(user.user?.name) : "?"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Avatar Upload */}
                    <Form {...avatarForm}>
                      <form
                        onSubmit={avatarForm.handleSubmit(uploadAvatar)}
                        className="flex justify-start items-end gap-4"
                      >
                        <FormField
                          control={avatarForm.control}
                          name="photo"
                          render={() => (
                            <FormItem className="my-2">
                              <FormLabel htmlFor="photo" className="text-lg">
                                Avatar Photo:
                              </FormLabel>
                              <FormControl>
                                {avatarPhoto && !isDeleted ? (
                                  <div>
                                    <Image
                                      src={avatarPhoto}
                                      alt="Avatar"
                                      width={200}
                                      height={200}
                                      className="rounded-lg"
                                    />
                                    <Button
                                      type="button"
                                      className="mt-4"
                                      onClick={handleDeleteAvatarPhoto}
                                    >
                                      Remove Photo
                                    </Button>
                                  </div>
                                ) : (
                                  <PhotoUploader
                                    onImageSelect={(image) =>
                                      avatarForm.setValue(
                                        "photo",
                                        image ?? undefined
                                      )
                                    }
                                  />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {watchedPhoto && (
                          <Button type="submit" className="mb-2">
                            Save Avatar
                          </Button>
                        )}
                      </form>
                    </Form>

                    {/* Profile Details Form */}
                    <Form {...profileForm}>
                      <form
                        onSubmit={profileForm.handleSubmit(updateProfile)}
                        className="space-y-4"
                      >
                        {/* Name */}
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name:</FormLabel>
                              <FormControl>
                                <Input {...field} className="w-80 text-md" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Bio */}
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio:</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={5} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Links */}
                        <div className="space-y-2">
                          <FormLabel className="text-lg">Links:</FormLabel>
                          {fields.map((field, index) => (
                            <div
                              key={field.id}
                              className="flex flex-wrap gap-2 mb-2"
                            >
                              <FormField
                                control={profileForm.control}
                                name={`links.${index}.label`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        placeholder="Label"
                                        className="w-80"
                                        {...field}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={profileForm.control}
                                name={`links.${index}.url`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        placeholder="URL"
                                        type="url"
                                        className="w-80"
                                        {...field}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => remove(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ label: "", url: "" })}
                          >
                            + Add Link
                          </Button>
                        </div>

                        <Button type="submit">Save Profile</Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account details and security.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.user?.email || ""}
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="max-w-3xl mx-auto py-5 space-y-4">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-32 rounded-md" />
              <Skeleton className="h-64 w-full rounded-md" />
              <Skeleton className="h-12 w-32 rounded-md" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
