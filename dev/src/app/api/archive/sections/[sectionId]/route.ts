import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import path from "path";
import { rm } from "fs/promises";
import { auth } from "@/lib/auth";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      sectionId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const { sectionId } = await params;

      const sql = `UPDATE board_sections SET archived = CURRENT_TIMESTAMP WHERE id = ?`;
      const value = [sectionId];
      await pool.query(sql, value);

      return Response.json({
        message: "successArchiveSection",
      });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      sectionId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const { sectionId } = await params;

      const sql = `UPDATE board_sections SET archived = NULL WHERE id = ?`;
      const value = [sectionId];
      await pool.query<RowDataPacket[]>(sql, value);

      return Response.json({
        message: "successRestoreSection",
      });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      sectionId: string;
    }>;
  }
) {
  let connection;
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      connection = await pool.getConnection();

      const { sectionId } = await params;

      const sql = `SELECT id_board FROM board_sections`;
      const value = [sectionId];
      const [row] = await connection.query<RowDataPacket[]>(sql, value);
      const section = row[0];

      const deleteSql = `DELETE FROM board_sections WHERE id = ?`;
      const deleteValue = [sectionId];
      await connection.beginTransaction();
      await connection.execute<RowDataPacket[]>(deleteSql, deleteValue);

      const directoryPath = path.join(
        process.cwd(),
        `/private/boards/${section.id_board}/${sectionId}`
      );
      await rm(directoryPath, { recursive: true, force: true });
      await connection.commit();

      return Response.json({
        message: "successDeleteSection",
      });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    await connection?.rollback();
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  } finally {
    connection?.release();
  }
}
