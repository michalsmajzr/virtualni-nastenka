import { pool } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { auth } from "@/lib/auth";

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      boardId: string;
      sectionId: string;
      pdfId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user) {
      const { id } = session?.user;
      const { pdfId } = await params;

      const sql = `
        INSERT INTO badges_posts (id_post, id_user) VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE time = CURRENT_TIMESTAMP`;
      const value = [pdfId, id];
      await pool.execute<ResultSetHeader[]>(sql, value);

      return Response.json({ message: "success" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
