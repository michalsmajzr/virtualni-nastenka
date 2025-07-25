import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";
import { mailer } from "@/lib/mailer";

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      userId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const { userId } = await params;

      const sql = `SELECT email FROM users WHERE id = ?`;
      const value = [userId];
      const [row] = await pool.execute<RowDataPacket[]>(sql, value);

      const token = mailer(row[0].email);

      const updateSql = `UPDATE users SET password = NULL, token = ? WHERE id = ?`;
      const updateValues = [token, userId];
      await pool.execute(updateSql, updateValues);

      return Response.json({ message: "successResetPassword" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
