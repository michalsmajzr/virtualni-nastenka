import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const sql = `
        SELECT bs.id, s.name, s.url
        FROM board_sections AS bs
        LEFT JOIN sections AS s ON s.id = bs.id_section
        WHERE bs.archived IS NOT NULL`;
      const [sections] = await pool.query<RowDataPacket[]>(sql);

      return Response.json({ sections, message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
