import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import path from "path";
import { promises as fs } from "fs";
import { auth } from "@/lib/auth";
import mime from "mime";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      boardId: string;
      sectionId: string;
      postId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user) {
      const { postId } = await params;

      const sql = `SELECT thumbnail_path FROM posts WHERE id = ?`;
      const value = [postId];
      const [row] = await pool.execute<RowDataPacket[]>(sql, value);

      console.log(row[0].thumbnail_path);

      if (row[0]) {
        const filePath = path.join(process.cwd(), row[0].thumbnail_path);

        const file = await fs.readFile(filePath);

        const type = mime.getType(filePath);

        return new Response(file, {
          status: 200,
          headers: {
            "Content-Type": type ?? "application/octet-stream",
            "Content-Length": file.length.toString(),
          },
        });
      } else {
        return Response.json({ error: "notFound" }, { status: 404 });
      }
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
