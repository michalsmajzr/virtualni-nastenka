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
      postId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const { postId } = await params;

      const sql = `UPDATE posts SET archived = CURRENT_TIMESTAMP WHERE id = ?`;
      const value = [postId];
      await pool.query(sql, value);

      return Response.json({
        message: "successArchivePost",
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
      postId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const { postId } = await params;

      const sql = `UPDATE posts SET archived = NULL WHERE id = ?`;
      const value = [postId];
      await pool.query<RowDataPacket[]>(sql, value);

      return Response.json({
        message: "successRestorePost",
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
      postId: string;
    }>;
  }
) {
  let connection;
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      connection = await pool.getConnection();

      const { postId } = await params;

      const sql = `
        SELECT bs.id_board, p.id_section
        FROM posts AS p
        LEFT JOIN board_sections AS bs
        ON p.id_section = bs.id WHERE p.id = ?`;
      const value = [postId];
      const [row] = await connection.query<RowDataPacket[]>(sql, value);
      const post = row[0];

      const deleteSql = `DELETE FROM posts WHERE id = ?`;
      const deleteValue = [postId];
      await connection.beginTransaction();
      await connection.execute<RowDataPacket[]>(deleteSql, deleteValue);

      const directoryPath = path.join(
        process.cwd(),
        `/private/boards/${post.id_board}/${post.id_section}/${postId}`
      );
      await rm(directoryPath, { recursive: true, force: true });
      await connection.commit();

      return Response.json({
        message: "successDeletePost",
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
