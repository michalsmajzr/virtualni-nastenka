import { pool } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
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
    if (session?.user && session?.user.role === "teacher") {
      const { boardId } = await params;

      const sql = `
      SELECT s.id, s.name, s.url, s.checked
      FROM sections AS s 
      LEFT JOIN board_sections AS bs 
      ON bs.id_board = ? and bs.id_section = s.id
      WHERE bs.id IS NULL;`;
      const value = [boardId];
      const [sections] = await pool.execute<RowDataPacket[]>(sql, value);

      return Response.json({ sections, message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}

export async function POST(
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
    if (session?.user && session?.user.role === "teacher") {
      const { boardId } = await params;
      const data = await request.json();
      const { sections } = data;
      if (!sections) {
        return Response.json({ error: "missingSections" }, { status: 400 });
      }

      const sqlInsertSections = `INSERT INTO board_sections (id_board, id_section) VALUES ?`;
      const newSections: [string, number][] = [];
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].checked === 1) {
          newSections.push([boardId, sections[i].id]);
        }
      }

      if (newSections.length === 0) {
        return Response.json({ error: "missingNewSections" }, { status: 401 });
      } else {
        await pool.query<ResultSetHeader>(sqlInsertSections, [newSections]);

        return Response.json({ message: "successAddSections" });
      }
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
