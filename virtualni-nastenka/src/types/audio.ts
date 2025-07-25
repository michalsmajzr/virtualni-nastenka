export interface Audio {
  id: number;
  id_question: number;
  name: string;
  url: string;
  time: Date;
}

export type AudioSection = Pick<Audio, "id" | "name" | "url">;
