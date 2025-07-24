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
      fileId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user) {
      const { fileId } = await params;

      const sql = `SELECT name, path FROM posts WHERE id = ? AND type = "file"`;
      const value = [fileId];
      const [row] = await pool.execute<RowDataPacket[]>(sql, value);

      const filePath = path.join(process.cwd(), row[0].path);

      const file = await fs.readFile(filePath);

      const type = mime.getType(filePath);
      const ext = path.extname(filePath);

      return new Response(file, {
        status: 200,
        headers: {
          "Content-Type": type ?? "application/octet-stream",
          "Content-Disposition": `attachment; filename="${row[0].name}${ext}"`,
          "Content-Length": file.length.toString(),
        },
      });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
