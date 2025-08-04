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
      boardId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const { boardId } = await params;

      const sql = `UPDATE boards SET archived = CURRENT_TIMESTAMP WHERE id = ?`;
      const value = [boardId];
      await pool.query(sql, value);

      return Response.json({
        message: "successArchiveBoard",
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
      boardId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const { boardId } = await params;

      const sql = `UPDATE boards SET archived = NULL WHERE id = ?`;
      const value = [boardId];
      await pool.query<RowDataPacket[]>(sql, value);

      return Response.json({
        message: "successRestoreBoard",
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
      boardId: string;
    }>;
  }
) {
  let connection;
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      connection = await pool.getConnection();

      const { boardId } = await params;

      const deleteSql = `DELETE FROM boards WHERE id = ?`;
      const deleteValue = [boardId];
      await connection.beginTransaction();
      await connection.execute<RowDataPacket[]>(deleteSql, deleteValue);

      const directoryPath = path.join(
        process.cwd(),
        `/private/boards/${boardId}`
      );
      await rm(directoryPath, { recursive: true, force: true });
      await connection.commit();

      return Response.json({
        message: "successDeleteBoard",
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
