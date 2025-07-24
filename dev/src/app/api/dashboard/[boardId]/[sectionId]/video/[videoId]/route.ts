import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      boardId: string;
      sectionId: string;
      videoId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user) {
      const { videoId } = await params;

      const sql = `SELECT name, url FROM posts WHERE id = ? AND type = "video"`;
      const value = [videoId];
      const [videos] = await pool.execute<RowDataPacket[]>(sql, value);

      return Response.json({ video: videos[0], message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
