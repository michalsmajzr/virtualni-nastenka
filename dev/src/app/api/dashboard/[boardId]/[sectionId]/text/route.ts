import { pool } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";
import { rm } from "fs/promises";
import { auth } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ boardId: string; sectionId: string }> }
) {
  let connection;
  let directoryPath;
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      connection = await pool.getConnection();

      const { boardId, sectionId } = await params;

      const data = await request.json();
      const { name, text } = data;
      if (!name) {
        return Response.json({ error: "missingName" }, { status: 400 });
      }
      if (!text) {
        return Response.json({ error: "missingText" }, { status: 400 });
      }

      if (name.length > 30) {
        return Response.json({ error: "nameTooLong" }, { status: 400 });
      }

      const thumbnailPath = `/private/boards/sections/posts/thumbnails/text.png`;
      const type = "text";
      const sql = `INSERT INTO posts (id_section, type, name, thumbnail_path, thumbnail_url, path, url) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const values = [sectionId, type, name, thumbnailPath, "", "", ""];
      await connection.beginTransaction();
      const [result] = await connection.execute<ResultSetHeader>(sql, values);

      const newNameText = `${crypto.randomUUID()}.json`;
      const buffer = JSON.stringify(text);

      directoryPath = path.join(
        process.cwd(),
        `/private/boards/${boardId}/${sectionId}/${result.insertId}`
      );
      await mkdir(directoryPath, { recursive: true });
      const filePath = path.join(
        process.cwd(),
        `/private/boards/${boardId}/${sectionId}/${result.insertId}`,
        newNameText
      );
      await writeFile(filePath, buffer, "utf-8");

      const thumbnailUrl = `/api/dashboard/${boardId}/${sectionId}/${result.insertId}/source`;
      const updateSql = `UPDATE posts SET thumbnail_url = ?, path = ? WHERE id = ?`;
      const updateValues = [thumbnailUrl, filePath, result.insertId];
      await connection.execute<ResultSetHeader>(updateSql, updateValues);
      await connection.commit();

      return Response.json({ message: "successAddText" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    await connection?.rollback();
    if (directoryPath) {
      await rm(directoryPath, { recursive: true, force: true });
    }
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
