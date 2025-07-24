import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
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
    const { questionId } = await params;

    const session = await auth();
    if (session?.user) {
      const { id } = session?.user;

      const sql = `
      SELECT ua.id_answer
      FROM user_answers AS ua
      JOIN answers AS a ON a.id = ua.id_answer
      WHERE a.id_question = ? AND ua.id_user = ?`;
      const values = [questionId, id];
      const [answer] = await pool.execute<RowDataPacket[]>(sql, values);

      return Response.json({ answer: answer[0], message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
