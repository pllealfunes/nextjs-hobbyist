export interface Post {
  id: string;
  title: string;
  coverphoto: string;
  content: string;
  category_id: number;
  published: boolean;
  private: boolean;
  author_id: string;
  created_at: Date;
  updated_at: Date;
}
