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

      const formData = await request.formData();
      const name = formData.get("name") as string;
      const audio = formData.get("audio");
      if (!name) {
        return Response.json({ error: "missingName" }, { status: 400 });
      }
      if (!audio) {
        return Response.json({ error: "missingAudio" }, { status: 400 });
      }

      if (name.length > 30) {
        return Response.json({ error: "nameTooLong" }, { status: 400 });
      }

      if (audio instanceof File && audio?.size > 0) {
        const thumbnailPath = `/private/boards/sections/posts/thumbnails/audio.jpg`;
        const type = "audio";
        const sql = `INSERT INTO posts (id_section, type, name, thumbnail_path, thumbnail_url, path, url) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [sectionId, type, name, thumbnailPath, "", "", ""];
        await connection.beginTransaction();
        const [result] = await connection.execute<ResultSetHeader>(sql, values);

        const ext = path.extname(audio.name);
        const newNameAudio = `${crypto.randomUUID()}${ext}`;

        const bytes = await audio.arrayBuffer();
        const buffer = Buffer.from(bytes);

        directoryPath = path.join(
          process.cwd(),
          `/private/boards/${boardId}/${sectionId}/${result.insertId}`
        );
        await mkdir(directoryPath, { recursive: true });
        const filePath = path.join(
          process.cwd(),
          `/private/boards/${boardId}/${sectionId}/${result.insertId}`,
          newNameAudio
        );
        await writeFile(filePath, buffer);

        const thumbnailUrl = `/api/dashboard/${boardId}/${sectionId}/${result.insertId}/source`;
        const audioPath = `/private/boards/${boardId}/${sectionId}/${result.insertId}/${newNameAudio}`;
        const url = `/api/dashboard/${boardId}/${sectionId}/audio/${result.insertId}/source`;
        const updateSql = `UPDATE posts SET thumbnail_url = ?, path = ?, url = ? WHERE id = ?`;
        const updateValues = [thumbnailUrl, audioPath, url, result.insertId];
        await connection.execute<ResultSetHeader>(updateSql, updateValues);

        await connection.commit();

        return Response.json({ message: "successAddAudio" });
      }
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
