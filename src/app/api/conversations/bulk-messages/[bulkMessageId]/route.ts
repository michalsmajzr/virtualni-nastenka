import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      bulkMessageId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user) {
      const { bulkMessageId } = await params;

      const sql = `SELECT id, id_sender, name, time, message, attachment_name, url FROM bulk_messages WHERE id = ?`;
      const values = [bulkMessageId];
      const [bulkMessage] = await pool.execute<RowDataPacket[]>(sql, values);

      return Response.json({
        bulkCurrentMessage: bulkMessage[0],
        message: "success",
      });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
