export type LoginField = "email" | "password";

export type LoginResult =
  | { success: true }
  | { fields: LoginField[]; message: string }
  | { message: string };

export interface Post {
  id: string;
  title: string;
  coverphoto?: string;
  content: string;
  category_id: number;
  published: boolean;
  private: boolean;
  author_id: string;
  created_at: Date;
  updated_at: Date;
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
