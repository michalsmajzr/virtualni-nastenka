export interface File {
  id: number;
  id_question: number;
  name: string;
  url: string;
  time: Date;
}

export type FileSection = Pick<File, "id" | "name" | "url">;
