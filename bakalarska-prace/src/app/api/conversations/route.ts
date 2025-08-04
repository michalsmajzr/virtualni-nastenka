import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user) {
      const { id } = session?.user;

      const sqlSearchTeacher = `
        SELECT c.id, u.url, u.firstname, u.surname, m.message, m.time, (
          SELECT COUNT(id) 
          FROM messages 
          WHERE id_conversation = c.id AND id_sender != ? AND badge_time IS NULL) AS badge_count
        FROM conversations AS c
        LEFT JOIN users AS u
        ON (c.id_teacher = ? AND u.id = c.id_parent)
          OR (c.id_parent = ? AND u.id = c.id_teacher)
        LEFT JOIN messages AS m	
        ON m.id = (
          SELECT id
          FROM messages
          WHERE id_conversation = c.id
          ORDER BY time DESC
          LIMIT 1)
        WHERE ((c.id_parent = ?) OR (c.id_teacher = ?))
        ORDER BY m.time DESC`;
      const values = [id, id, id, id, id];
      const [conversations] = await pool.execute<RowDataPacket[]>(
        sqlSearchTeacher,
        values
      );

      return Response.json({ conversations, message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
