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
      const { boardId, sectionId } = await params;

      const sqlBoard = `SELECT name FROM boards WHERE id = ?`;
      const valueBoard = [boardId];
      const [board] = await pool.execute<RowDataPacket[]>(sqlBoard, valueBoard);

      if (!board[0]) {
        return Response.json({ error: "notFound" }, { status: 404 });
      }

      const sqlSection = `
        SELECT s.name FROM board_sections AS bs 
        LEFT JOIN sections AS s ON s.id = bs.id_section 
        WHERE bs.id = ?`;
      const valueSection = [sectionId];
      const [section] = await pool.execute<RowDataPacket[]>(
        sqlSection,
        valueSection
      );

      if (!section[0]) {
        return Response.json({ error: "notFound" }, { status: 404 });
      }

      return Response.json({
        nameBoard: board[0].name,
        nameSection: section[0].name,
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
