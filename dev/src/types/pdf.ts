export interface Pdf {
  id: number;
  id_question: number;
  name: string;
  url: string;
  time: Date;
}

export type PdfSection = Pick<Pdf, "id" | "name" | "url">;
