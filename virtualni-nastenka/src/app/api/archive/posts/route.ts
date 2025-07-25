import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const sql = `SELECT id, type, name, thumbnail_url FROM posts 
        WHERE archived IS NOT NULL`;
      const [posts] = await pool.query<RowDataPacket[]>(sql);

      return Response.json({ posts, message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
