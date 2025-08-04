import { pool } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      questionId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user) {
      const { questionId } = await params;

      const sql = `
      SELECT a.id, a.id_question, a.answer, IF (v.votes IS NULL, 0, v.votes) AS votes
      FROM answers AS a
      LEFT JOIN (
        SELECT id_answer, COUNT(id_user) AS votes
        FROM user_answers
        GROUP BY id_answer) AS v
      ON v.id_answer = a.id
      WHERE a.id_question = ?`;
      const value = [questionId];
      const [answers] = await pool.execute<RowDataPacket[]>(sql, value);

      return Response.json({ answers, message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      questionId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const { questionId } = await params;

      const sql = `DELETE FROM questions WHERE id = ?`;
      const value = [questionId];
      await pool.execute<ResultSetHeader>(sql, value);

      return Response.json({
        question: questionId,
        message: "successDeletePoll",
      });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
