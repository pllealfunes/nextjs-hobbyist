export type LoginField = "email" | "password";

export type LoginResult =
  | { success: true }
  | { fields: LoginField[]; message: string }
  | { message: string };

export interface Post {
  id: string;
  title: string;
  content: string;
  category_id: number;
  coverphoto?: string;
  author_id: string;
  published: boolean;
  user: {
    id: string;
    username: string;
  };
  profile: {
    id: string;
    photo: string | null;
  };
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  comment: string;
  created_at: string;
  updated_at?: string;
  author: {
    id: string;
    username: string;
    photo?: string;
  };
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "ADMIN" | "USER";
  bio?: string;
  photo?: string;
  links?: SocialLink[];
}

export interface FollowingUser {
  id: number;
  name: string;
  username: string;
  avatar?: string;
  isFollowing: boolean;
}

export interface CategoryWithFollow {
  id: number;
  name: string;
  isFollowing: boolean;
}
