export type PostType = "photo" | "video" | "text" | "pdf" | "file" | "audio";

export interface Post {
  id: number;
  id_section: number;
  type: PostType;
  name: string;
  thumbnail_path: string;
  thumbnail_url: string;
  path: string;
  url: string;
  time: Date;
  badge_time: Date;
}

export type PostSection = Pick<Post, "name" | "url">;
