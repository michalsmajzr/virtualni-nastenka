import { pool } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { auth } from "@/lib/auth";

export async function PUT(
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
      const { id } = session?.user;
      const { conversationId } = await params;

      const sql = `UPDATE messages SET badge_time = CURRENT_TIME WHERE id_conversation = ? AND id_sender != ?`;
      const values = [conversationId, id];
      await pool.execute<ResultSetHeader[]>(sql, values);

      return Response.json({ message: "success" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
