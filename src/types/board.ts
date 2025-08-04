export interface Board {
  id: number;
  url: string;
  name: string;
  badge_count: number;
}

export type Picture = Pick<Board, "id" | "url">;
