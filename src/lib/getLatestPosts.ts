import { createClient } from "@/utils/supabase/server";
import { Post } from "./types";

type PartialUser = { id: string; username: string };
type PartialProfile = { id: string; photo: string | null };

export async function postsWithUserData(posts: Post[]) {
  const supabase = await createClient();

  const authorIds = posts.map((post) => post.author_id).filter(Boolean);
  if (!authorIds.length) return posts;

  const [usersRes, profilesRes] = await Promise.all([
    supabase.from("User").select("id, username").in("id", authorIds),
    supabase.from("Profile").select("id, photo").in("id", authorIds),
  ]);

  if (usersRes.error || profilesRes.error) {
    throw new Error(
      `Error fetching user/profile data:\nUsers: ${usersRes.error?.message}\nProfiles: ${profilesRes.error?.message}`
    );
  }

  return posts.map((post) => ({
    ...post,
    user: usersRes.data.find(
      (user: PartialUser) => user.id === post.author_id
    ) || {
      id: post.author_id,
      username: "Unknown User",
    },
    profile: profilesRes.data.find(
      (profile: PartialProfile) => profile.id === post.author_id
    ) || {
      id: post.author_id,
      photo: null,
    },
  }));
}
