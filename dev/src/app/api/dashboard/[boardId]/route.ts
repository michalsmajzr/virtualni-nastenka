import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      boardId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user) {
      const id = session.user.id;
      const { boardId } = await params;

      const sectionsSql = `
        SELECT bs.id, s.name, s.url, IF(sc.badge_count IS NULL, 0, sc.badge_count) AS badge_count
        FROM board_sections AS bs LEFT JOIN sections AS s ON s.id = bs.id_section
        LEFT JOIN (SELECT p.id_section, COUNT(p.id) AS badge_count FROM posts AS p
          LEFT JOIN badges_posts AS bp ON bp.id_post = p.id AND bp.id_user = ? 
          WHERE p.archived IS NULL AND bp.time IS NULL 
          GROUP BY p.id_section) AS sc ON bs.id = sc.id_section 
        WHERE bs.id_board = ? AND bs.archived IS NULL`;
      const sectionsValues = [id, boardId];
      const [sections] = await pool.execute<RowDataPacket[]>(
        sectionsSql,
        sectionsValues
      );

      return Response.json({
        sections,
        message: "success",
      });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
