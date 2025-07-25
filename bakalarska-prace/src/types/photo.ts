export interface Photo {
  id: number;
  id_post: number;
  path: string;
  url: string;
  thumbnail_path: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
}

export type Thumbnail = Pick<
  Photo,
  "thumbnail_url" | "thumbnail_width" | "thumbnail_height"
>;
