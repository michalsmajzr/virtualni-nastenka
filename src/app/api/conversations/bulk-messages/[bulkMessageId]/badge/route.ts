import { pool } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { auth } from "@/lib/auth";

export async function PUT(
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
      const { id } = session?.user;
      const { bulkMessageId } = await params;

      const sql = `INSERT INTO badges_bulk_messages (id_bulk_message, id_user) VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE time = CURRENT_TIMESTAMP`;
      const values = [bulkMessageId, id];
      await pool.execute<ResultSetHeader[]>(sql, values);

      return Response.json({ message: "success" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
