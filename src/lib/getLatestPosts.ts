import { UserProfile } from "@/lib/types";

export async function enrichPostsWithUserData(supabase: any, posts: any[]) {
  const authorIds = posts.map((p) => p.author_id).filter(Boolean);
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
      (user: UserProfile) => user.id === post.author_id
    ) || {
      id: post.author_id,
      username: "Unknown User",
    },
    profile: profilesRes.data.find(
      (profile: UserProfile) => profile.id === post.author_id
    ) || {
      id: post.author_id,
      photo: null,
    },
  }));
}
