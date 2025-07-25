import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      answerId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const { answerId } = await params;

      const sql = `SELECT answer FROM answers WHERE id = ?`;
      const values = [answerId];
      const [answer] = await pool.execute<RowDataPacket[]>(sql, values);

      const usersSql = `
        SELECT ua.id, u.url, u.firstname, u.surname
        FROM users AS u
        JOIN user_answers AS ua
        ON ua.id_user = u.id AND ua.id_answer = ?`;
      const usersValue = [answerId];
      const [users] = await pool.execute<RowDataPacket[]>(usersSql, usersValue);

      return Response.json({ answer: answer[0], users, message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
