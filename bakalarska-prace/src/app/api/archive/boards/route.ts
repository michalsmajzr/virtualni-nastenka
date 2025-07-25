import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const sql = `
        SELECT b.id, bp.url, b.name
        FROM boards AS b
        LEFT JOIN board_pictures AS bp
        ON bp.id = b.id_picture WHERE archived IS NOT NULL`;
      const [boards] = await pool.query<RowDataPacket[]>(sql);

      return Response.json({ boards, message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
