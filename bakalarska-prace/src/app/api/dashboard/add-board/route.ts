import { pool } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  let connection;
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      connection = await pool.getConnection();

      const data = await request.json();
      const { name, idPicture, sections } = data;
      if (!name) {
        return Response.json({ error: "missingName" }, { status: 400 });
      }
      if (!idPicture) {
        return Response.json({ error: "missingIdPicture" }, { status: 400 });
      }
      if (!sections) {
        return Response.json({ error: "missingSections" }, { status: 400 });
      }

      if (name.length > 30) {
        return Response.json({ error: "nameTooLong" }, { status: 400 });
      }

      const boardSql = `INSERT INTO boards (name, id_picture) VALUES (?, ?)`;
      const values = [name, idPicture];
      const [resultBoard] = await connection.execute<ResultSetHeader>(
        boardSql,
        values
      );

      if (resultBoard.insertId) {
        const sectionsSql = `INSERT INTO board_sections (id_board, id_section) VALUES ?`;
        const newSections: [number, number][] = [];
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].checked === 1) {
            newSections.push([resultBoard.insertId, sections[i].id]);
          }
        }

        if (newSections.length === 0) {
          return Response.json(
            { error: "missingNewSections" },
            { status: 401 }
          );
        } else {
          await connection.query<ResultSetHeader>(sectionsSql, [newSections]);
          await connection.commit();

          return Response.json({ message: "successCreateBoard" });
        }
      }
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    await connection?.rollback();
    console.error(error);
    const errorType = error as { code?: string };
    if (errorType?.code === "ER_DUP_ENTRY") {
      return Response.json({ error: "notUniqueName" }, { status: 400 });
    }
    return Response.json({ error: "serverError" }, { status: 500 });
  } finally {
    connection?.release();
  }
}
