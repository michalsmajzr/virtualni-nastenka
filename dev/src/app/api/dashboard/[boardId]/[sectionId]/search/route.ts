import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string; sectionId: string }> }
) {
  try {
    const session = await auth();
    if (session?.user) {
      const searchParams = request.nextUrl.searchParams;
      const query = searchParams.get("query");

      const { sectionId } = await params;

      const pattern = `${query}%`;
      const sql = `SELECT id, type, name, thumbnail_url FROM posts WHERE name LIKE ? AND id_section = ? AND archived IS NULL ORDER BY time DESC`;
      const values = [pattern, sectionId];
      const [posts] = await pool.execute<RowDataPacket[]>(sql, values);

      return Response.json({ posts, message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
