import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ boardId: string; sectionId: string }> }
) {
  try {
    const session = await auth();
    if (session?.user) {
      const { id } = session?.user;
      const { sectionId } = await params;

      const sql = `
        SELECT p.id, p.type, p.name, p.thumbnail_url, bp.time AS badge_time
        FROM posts AS p
        LEFT JOIN badges_posts AS bp ON bp.id_post = p.id AND bp.id_user = ?
        WHERE p.id_section = ? AND p.archived IS NULL ORDER BY p.time DESC`;
      const value = [id, sectionId];
      const [posts] = await pool.execute<RowDataPacket[]>(sql, value);

      return Response.json({ posts, message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
