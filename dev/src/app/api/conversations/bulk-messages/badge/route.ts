import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user) {
      const id = session.user.id;

      const sql = `
        SELECT COUNT(bm.id) AS badge_count FROM bulk_messages AS bm
        LEFT JOIN badges_bulk_messages AS bbm ON bbm.id_bulk_message = bm.id AND bbm.id_user = ?
        WHERE bbm.time IS NULL`;
      const value = [id];
      const [badge] = await pool.execute<RowDataPacket[]>(sql, value);

      return Response.json({ badge: badge[0], message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
