"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  changeEmail,
  changePassword,
  updateProfileDetails,
  updateAvatarPhoto,
  deleteAvatarPhoto,
} from "@/app/usersettings/actions";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
//import { Label } from "@/ui/components/label";
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
import { UserProfile } from "@/lib/types";
import {
  ProfileDetailsSchema,
  AvatarSchema,
  EmailSchema,
  PasswordSchema,
} from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhotoUploader from "@/ui/components/photo-uploader";
import DeleteAvatarConfirmation from "@/ui/components/deleteAvatarConfirmation";
import { Skeleton } from "@/ui/components/skeleton";
import { toast } from "react-hot-toast";
import { fileToBase64, avatarToCloudinary } from "@/utils/postHandler";
import { useRouter } from "next/navigation";

// Define the type for forms data
type AvatarData = z.infer<typeof AvatarSchema>;
type ProfileData = z.infer<typeof ProfileDetailsSchema>;
type EmailData = z.infer<typeof EmailSchema>;
type PasswordData = z.infer<typeof PasswordSchema>;

export default function UserSettings() {
  const user = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [avatarPhoto, setAvatarPhoto] = useState(userData?.photo || null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEmailDisabled, setIsEmailDisabled] = useState(false);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(false);
  const [isAvatarDisabled, setIsAvatarDisabled] = useState(false);
  const [isProfileDisabled, setIsProfileDisabled] = useState(false);
  const router = useRouter();

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
      name: userData?.name || "",
      username: userData?.username || "",
      bio: userData?.bio || "",
      links: userData?.links ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: profileForm.control,
    name: "links",
  });

  const emailForm = useForm<EmailData>({
    mode: "onTouched",
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: userData?.email,
    },
  });

  const passwordForm = useForm<PasswordData>({
    mode: "onTouched",
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      passConfirmation: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const userId = user.user?.id;
      if (!userId) return;

      try {
        const userRes = await fetch("/api/user");
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userInfo = await userRes.json();

        const profileRes = await fetch("/api/profile");
        if (!profileRes.ok) throw new Error("Failed to fetch profile data");
        const profileInfo = await profileRes.json();

        if (userInfo && profileInfo) {
          const fetchedUserData = {
            id: userInfo.id,
            name: userInfo.name || "",
            username: userInfo.username || "",
            photo: profileInfo.photo || undefined,
            email: userInfo.email || "",
            role: userInfo.role || "USER",
            bio: profileInfo.bio || "",
            links: profileInfo.links || [],
          };

          setUserData(fetchedUserData);
          setAvatarPhoto(profileInfo.photo);
          // Reset form values when userData is fetched
          profileForm.reset({
            name: fetchedUserData.name,
            username: fetchedUserData.username,
            bio: fetchedUserData.bio,
            links: fetchedUserData.links,
          });
          emailForm.reset({
            email: fetchedUserData.email,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [user, profileForm]);

  const getUserInitials = (name?: string | null) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const handleDeleteAvatarPhoto = async () => {
    if (!avatarPhoto) {
      toast.error("Avatar photo not loaded.");
      return;
    }

    await toast.promise(
      (async () => {
        const result = await deleteAvatarPhoto();

        if (!result.success) {
          toast.error(`Failed to delete image: ${result.error}`);
        }

        setAvatarPhoto(null);
        setIsDeleted(false);
        avatarForm.reset({ photo: undefined });
      })(),
      {
        loading: "Deleting Avatar...",
        success: "Avatar Deleted Successfully!",
        error: (err) =>
          `Failed to delete avatar: ${err.message || err.toString()}`,
      }
    );
  };

  const uploadAvatar: SubmitHandler<AvatarData> = async (data) => {
    if (!userData) {
      toast.error("User data not loaded.");
      return;
    }

    setIsAvatarDisabled(true);

    await toast.promise(
      (async () => {
        let photoUrl: string | null = null;

        // Convert image to Base64 in the client
        if (data.photo instanceof File) {
          const base64 = await fileToBase64(data.photo);

          if (!base64) {
            throw new Error("Failed to convert image to Base64.");
          }

          photoUrl = await avatarToCloudinary(base64, userData);
        }

        if (!photoUrl) {
          throw new Error("Failed to upload avatar.");
        }

        // Now, update the user profile with the Cloudinary URL via the server action
        const result = await updateAvatarPhoto(photoUrl);

        if (!result.success) {
          throw new Error(result.error);
        }

        setAvatarPhoto(result.photo || null);
      })(),
      {
        loading: "Uploading Avatar...",
        success: "Avatar Uploaded Successfully!",
        error: (err) => {
          setIsAvatarDisabled(false);
          return `Failed to upload avatar: ${err.message || err.toString()}`;
        },
      }
    );

    setIsAvatarDisabled(false);
  };

  const updateProfile: SubmitHandler<ProfileData> = async (data) => {
    console.log("Submitted data:", data);

    if (!userData) {
      toast.error("User data not loaded.");
      return;
    }
    if (!data) {
      toast.error("Data not loaded or available.");
      return;
    }

    if (!data.bio && !data.links && !data.name && !data.username) {
      toast.error("Please provide at least one field to update.");
      return;
    }

    setIsProfileDisabled(true);
    await toast.promise(
      (async () => {
        const profileFinalPayload: Partial<ProfileData> = {
          bio: data.bio?.trim() || undefined,
          links: data.links?.length ? data.links : undefined,
          name: data.name?.trim() || undefined,
          username: data.username?.trim() || undefined,
        };

        const result = await updateProfileDetails(profileFinalPayload);

        if (!result.success) {
          throw new Error(result.error);
        }
      })(),
      {
        loading: "Updating Profile...",
        success: "Successfully Updated Profile!",
        error: (err) => {
          setIsProfileDisabled(false);
          return `Failed to update avatar: ${err.message || err.toString()}`;
        },
      }
    );
    setIsProfileDisabled(false);
  };

  const updateEmail: SubmitHandler<EmailData> = async (data) => {
    console.log("Submitted data:", data);

    if (!userData) {
      toast.error("User data not loaded.");
      return;
    }
    if (!data.email) {
      toast.error("Please enter a new email.");
      return;
    }

    setIsEmailDisabled(true);

    await toast.promise(
      (async () => {
        const result = await changeEmail(data.email);

        if (!result.success) {
          throw new Error(result.error);
        }

        const supabase = await createClient();

        await supabase.auth.signOut();

        return router.push("/verify-email");
      })(),
      {
        loading: "Updating Email...",
        success: "Successfully Updated Email!",
        error: (err) => {
          setIsEmailDisabled(false);
          return `Failed to update email: ${err.message || err.toString()}`;
        },
      }
    );
    setIsEmailDisabled(false);
  };

  const updatePassword: SubmitHandler<PasswordData> = async (data) => {
    if (!userData) {
      toast.error("User data not loaded.");
      return;
    }
    if (!data) {
      toast.error("Data not loaded or available.");
      return;
    }

    setIsPasswordDisabled(true);
    await toast.promise(
      (async () => {
        const result = await changePassword(
          data.currentPassword,
          data.newPassword,
          data.passConfirmation
        );

        if (!result.success) {
          throw new Error(result.error);
        }

        return router.push("/login");
      })(),
      {
        loading: "Updating Password...",
        success: "Successfully Updated Password! Please Log in Again",
        error: (err) => {
          setIsPasswordDisabled(false);
          return `Failed to update password: ${err.message || err.toString()}`;
        },
      }
    );
    setIsPasswordDisabled(false);
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
                        src={avatarPhoto || undefined}
                        alt={getUserInitials(userData.name)}
                      />
                      <AvatarFallback>
                        {userData ? getUserInitials(userData.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    {/* Delete Avatar Confirmation */}
                    {avatarPhoto && !isDeleted ? (
                      <DeleteAvatarConfirmation
                        onConfirm={handleDeleteAvatarPhoto}
                      />
                    ) : (
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
                                <FormLabel
                                  htmlFor="photo"
                                  className="text-lg"
                                ></FormLabel>
                                <FormControl>
                                  <PhotoUploader
                                    onImageSelect={(image) =>
                                      avatarForm.setValue(
                                        "photo",
                                        image ?? undefined
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Save Avatar Button Logic */}
                          {watchedPhoto &&
                            (watchedPhoto instanceof File ||
                              (typeof watchedPhoto === "string" &&
                                watchedPhoto !== avatarPhoto)) && (
                              <Button
                                type="submit"
                                className="mb-2"
                                disabled={isAvatarDisabled}
                              >
                                Save Avatar
                              </Button>
                            )}
                        </form>
                      </Form>
                    )}

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

                        {/* Username */}
                        <FormField
                          control={profileForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username:</FormLabel>
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
                            className="ml-2"
                            onClick={() => append({ label: "", url: "" })}
                          >
                            + Add Link
                          </Button>
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isProfileDisabled}>
                            Save Profile
                          </Button>
                        </div>
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
                      <Form {...emailForm}>
                        <form
                          onSubmit={emailForm.handleSubmit(updateEmail)}
                          className="space-y-4"
                        >
                          {/* Email */}
                          <FormField
                            control={emailForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email:</FormLabel>
                                <FormControl>
                                  <Input {...field} className="w-80 text-md" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" disabled={isEmailDisabled}>
                            Save Email
                          </Button>
                        </form>
                      </Form>
                    </div>
                    <div className="space-y-2">
                      <Form {...passwordForm}>
                        <form
                          onSubmit={passwordForm.handleSubmit(updatePassword)}
                          className="space-y-4"
                        >
                          {/* Password */}
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password:</FormLabel>
                                <FormControl>
                                  <Input {...field} className="w-80 text-md" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password:</FormLabel>
                                <FormControl>
                                  <Input {...field} className="w-80 text-md" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={passwordForm.control}
                            name="passConfirmation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password:</FormLabel>
                                <FormControl>
                                  <Input {...field} className="w-80 text-md" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" disabled={isPasswordDisabled}>
                            Save Password
                          </Button>
                        </form>
                      </Form>
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
