import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import path from "path";
import { readFile, writeFile } from "fs/promises";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      boardId: string;
      sectionId: string;
      textId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user) {
      const { textId } = await params;

      const sql = `SELECT name, path FROM posts WHERE id = ? AND type = "text"`;
      const value = [textId];
      const [texts] = await pool.execute<RowDataPacket[]>(sql, value);

      const text = texts[0];
      if (text) {
        const filePath = path.join(process.cwd(), text.path);
        const buffer = await readFile(filePath, "utf-8");
        const textData = {
          name: text.name,
          content: JSON.parse(buffer),
        };

        return Response.json({ text: textData, message: "success" });
      } else {
        return Response.json({ error: "missingText" }, { status: 401 });
      }
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
      sectionId: string;
      textId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const { textId } = await params;
      const id = session.user.id;

      const data = await request.json();
      const { text } = data;
      if (!text) {
        return Response.json({ error: "missingText" }, { status: 400 });
      }

      const sql = `SELECT path FROM posts WHERE type = "text" AND id = ?`;
      const value = [textId];
      const [texts] = await pool.execute<RowDataPacket[]>(sql, value);

      const filePath = texts[0].path;
      if (filePath) {
        const buffer = JSON.stringify(text);
        await writeFile(filePath, buffer, "utf-8");

        const updateSql = `DELETE FROM badges_posts WHERE id_post = ? AND id_user = ?`;
        const updateValues = [textId, id];
        await pool.execute<RowDataPacket[]>(updateSql, updateValues);

        return Response.json({ message: "successEditText" });
      } else {
        return Response.json({ error: "missingUrl" }, { status: 400 });
      }
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
