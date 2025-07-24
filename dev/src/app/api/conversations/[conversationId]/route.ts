import { pool } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { rm } from "fs/promises";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      conversationId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user) {
      const { conversationId } = await params;

      const sql = `SELECT id, id_sender, message, attachment_name, url FROM messages WHERE id_conversation = ?`;
      const values = [conversationId];
      const [messages] = await pool.execute<RowDataPacket[]>(sql, values);

      return Response.json({ messages, message: "success" });
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
      conversationId: string;
    }>;
  }
) {
  let connection;
  let filePath;
  try {
    const { conversationId } = await params;
    const session = await auth();
    if (session?.user) {
      const { id } = session?.user;

      connection = await pool.getConnection();

      const formData = await request.formData();
      const message = formData.get("message");
      const attachment = formData.get("attachment");
      if (!message && !attachment) {
        return Response.json(
          { error: "missingMessageOrAttachment" },
          { status: 400 }
        );
      }

      if (attachment instanceof File && attachment?.size > 0 && message) {
        const ext = path.extname(attachment.name);
        const newNameFile = `${crypto.randomUUID()}${ext}`;

        const bytes = await attachment.arrayBuffer();
        const buffer = Buffer.from(bytes);

        filePath = path.join(
          process.cwd(),
          "/private/attachments/",
          newNameFile
        );
        await writeFile(filePath, buffer);

        const newPath = `/private/attachments/${newNameFile}`;
        const sql = `INSERT INTO messages (id_conversation, id_sender, message, attachment_name, attachment_path) 
          VALUES (?, ?, ?, ?, ?)`;
        const values = [conversationId, id, message, attachment.name, newPath];
        await connection.beginTransaction();
        const [result] = await connection.execute<ResultSetHeader>(sql, values);

        const url = `/api/conversations/${conversationId}/${result.insertId}/source`;
        const updateSql = `UPDATE messages SET url = ? WHERE id = ?`;
        const updateValue = [url, result.insertId];
        await connection.execute<ResultSetHeader>(updateSql, updateValue);

        await connection.commit();
        return Response.json({ id: result.insertId, message: "success" });
      } else if (attachment instanceof File && attachment?.size > 0) {
        const ext = path.extname(attachment.name);
        const newNameFile = `${crypto.randomUUID()}${ext}`;

        const bytes = await attachment.arrayBuffer();
        const buffer = Buffer.from(bytes);

        filePath = path.join(
          process.cwd(),
          "/private/attachments/",
          newNameFile
        );
        await writeFile(filePath, buffer);

        const newPath = `/private/attachments/${newNameFile}`;
        const sql = `INSERT INTO messages (id_conversation, id_sender, message, attachment_name, attachment_path) 
          VALUES (?, ?, ?, ?, ?)`;
        const values = [conversationId, id, message, attachment.name, newPath];
        await connection.beginTransaction();
        const [result] = await connection.execute<ResultSetHeader>(sql, values);

        const url = `/api/conversations/${conversationId}/${result.insertId}/source`;
        const updateSql = `UPDATE messages SET url = ? WHERE id = ?`;
        const updateValue = [url, result.insertId];
        await connection.execute<ResultSetHeader>(updateSql, updateValue);

        await await connection.commit();
        return Response.json({ id: result.insertId, message: "success" });
      } else if (message) {
        const sql = `INSERT INTO messages (id_conversation, id_sender, message) VALUES (?, ?, ?)`;
        const values = [conversationId, id, message];
        await connection.execute(sql, values);

        return Response.json({ message: "successSendMessage" });
      } else {
        console.log(message, attachment);
        return Response.json(
          { error: "notFoundMessageOrAttachment" },
          { status: 404 }
        );
      }
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    await connection?.rollback();
    if (filePath) {
      await rm(filePath, { force: true });
    }
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  } finally {
    connection?.release();
  }
}
