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

      // Fetch user data
      const { data: userData } = await supabase
        .from("User")
        .select("id, name, username, email, role")
        .eq("id", userId)
        .single();

      // Fetch profile data
      const { data: profileData } = await supabase
        .from("Profile")
        .select("bio, photo, links")
        .eq("id", userId)
        .single();

      if (userData && profileData) {
        setUserData({
          id: userData.id,
          name: userData.name || "",
          username: userData.username || "",
          email: userData.email || "",
          role: userData.role || "USER",
          bio: profileData.bio || "",
          links: profileData.links || [],
        });
        setAvatarPhoto(profileData.photo || "");
      }
    };

    fetchData();
  }, []);

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

  const uploadAvatar: SubmitHandler<AvatarData> = (data) => {
    console.log("Submitted data:", data);
    // Send data to Supabase to update the profile
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
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
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
                      src="/placeholder.svg?height=80&width=80"
                      alt={user.user?.name || getUserInitials(user.user?.name)}
                    />
                    <AvatarFallback>
                      {user ? (
                        <p>{getUserInitials(user.user?.name)}</p>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {/* Cover Photo Field */}
                  <Form {...avatarForm}>
                    <form
                      onSubmit={avatarForm.handleSubmit(uploadAvatar)}
                      className="flex justify-start items-end"
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
                              {userData?.photo && !isDeleted ? (
                                <div>
                                  <Image
                                    src={avatarPhoto}
                                    alt="Avatar Photo Preview"
                                    width={200}
                                    height={200}
                                    className="rounded-lg"
                                  />
                                  <Button
                                    className="mt-4"
                                    onClick={handleDeleteAvatarPhoto}
                                  >
                                    Remove Photo
                                  </Button>
                                </div>
                              ) : (
                                <PhotoUploader
                                  onImageSelect={(image) => {
                                    console.log(
                                      "Selected Image Base64:",
                                      image
                                    );
                                    avatarForm.setValue(
                                      "photo",
                                      image ?? undefined
                                    );
                                  }}
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
                  {/* Form */}
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(updateProfile)}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        {/* Name Field */}
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="title" className="text-lg">
                                Name:
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="mb-2 w-80 text-md px-2 py-1 border rounded-md text-lg"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {/* Links Field Array */}
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
                                      placeholder="Label (e.g., GitHub)"
                                      className="w-80 text-md px-2 py-1"
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
                                      className="w-80 text-md px-2 py-1"
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

                      {/* Bio Field */}
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem className="my-2">
                            <FormLabel htmlFor="content" className="text-lg">
                              Bio:
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                id="bio"
                                rows={5}
                                {...field}
                                className="text-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Settings Section */}
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
                      value={user.user?.email || ""}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                    {/* <Input
                      id="current-password"
                      type="password"
                      value={user.user?.password || ""}
                      onChange={(e) => setEmail(e.target.value)}
                    /> */}
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
          {/* <div className="mt-8 flex justify-end">
            <Button onClick={handleSubmit(onSubmit)}>Save Changes</Button>
          </div> */}
        </div>
      </main>
    </div>
  );
}
