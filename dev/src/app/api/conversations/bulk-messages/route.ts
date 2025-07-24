import { pool } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { rm } from "fs/promises";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user) {
      const id = session.user.id;

      const sql = `
        SELECT bm.id, bm.name, bm.time, bbm.time AS badge_time
        FROM bulk_messages AS bm
        LEFT JOIN badges_bulk_messages AS bbm ON bbm.id_bulk_message = bm.id AND bbm.id_user = ?
        ORDER BY bm.id DESC`;
      const value = [id];
      const [bulkMessages] = await pool.execute<RowDataPacket[]>(sql, value);

      return Response.json({ bulkMessages, message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let connection;
  let filePath;
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const { id } = session?.user;

      connection = await pool.getConnection();

      const formData = await request.formData();
      const name = formData.get("name") as string;
      const message = formData.get("message");
      const attachment = formData.get("attachment");
      if (!name) {
        return Response.json({ error: "missingName" }, { status: 400 });
      }
      if (!message) {
        return Response.json({ error: "missingMessage" }, { status: 400 });
      }

      if (name.length > 255) {
        return Response.json({ error: "nameTooLong" }, { status: 400 });
      }

      if (attachment instanceof File && attachment?.size > 0) {
        const ext = path.extname(attachment.name);
        const newNameFile = `${crypto.randomUUID()}${ext}`;

        const bytes = await attachment.arrayBuffer();
        const buffer = Buffer.from(bytes);

        filePath = path.join(
          process.cwd(),
          "/private/bulk-attachments",
          newNameFile
        );
        await writeFile(filePath, buffer);

        const newPath = `/private/bulk-attachments/${newNameFile}`;
        const sql = `INSERT INTO bulk_messages (id_sender, name, message, attachment_name, attachment_path)
            VALUES (?, ?, ?, ?, ?)`;
        const values = [id, name, message, attachment.name, newPath];
        await connection.beginTransaction();
        const [result] = await connection.execute<ResultSetHeader>(sql, values);

        const url = `/api/conversations/bulk-messages/${result.insertId}/source`;
        const updateSql = `UPDATE bulk_messages SET url = ? WHERE id = ?`;
        const updateValue = [url, result.insertId];
        await connection.execute<ResultSetHeader>(updateSql, updateValue);

        await connection.commit();
        return Response.json({ id: result.insertId, message: "success" });
      } else if (message) {
        const sql = `INSERT INTO bulk_messages (id_sender, name, message)
            VALUES (?, ?, ?)`;
        const values = [id, name, message];
        const [result] = await connection.execute<ResultSetHeader>(sql, values);

        return Response.json({
          id: result.insertId,
          message: "successSendMessage",
        });
      } else {
        return Response.json({ error: "notFoundMessage" }, { status: 404 });
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
