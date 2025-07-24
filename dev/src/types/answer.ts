export interface Answer {
  id: number;
  answer: string;
  votes: string;
}

export type AnswerAdd = Pick<Answer, "id" | "answer">;
