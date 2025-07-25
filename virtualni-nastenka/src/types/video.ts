export interface Video {
  id: number;
  id_question: number;
  name: string;
  url: string;
  time: Date;
}

export type VideoSection = Pick<Video, "id" | "name" | "url">;
