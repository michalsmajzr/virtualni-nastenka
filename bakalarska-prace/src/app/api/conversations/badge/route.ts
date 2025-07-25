import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user) {
      const id = session.user.id;
      const sql = `
        SELECT COUNT(m.id) AS badge_count FROM messages AS m
        LEFT JOIN conversations AS c ON c.id = m.id_conversation
        WHERE m.id_sender != ? AND m.badge_time IS NULL AND (c.id_teacher = ? OR c.id_parent = ?)`;
      const values = [id, id, id];
      const [badge] = await pool.execute<RowDataPacket[]>(sql, values);

      return Response.json({ badge: badge[0], message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
