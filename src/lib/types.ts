export interface Post {
  id: string;
  title: string;
  coverphoto: string | null | undefined;
  content: string;
  category_id: number;
  published: boolean;
  private: boolean;
  author_id: string;
  created_at: Date;
  updated_at: Date;
}

export type Category = {
  id: number;
  name: string;
};

export type UserProfile = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  bio?: string;
  photo?: string;
  links?: { label: string; url: string }[]; // Links as an array of objects with label and url
};
