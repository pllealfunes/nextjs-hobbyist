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
