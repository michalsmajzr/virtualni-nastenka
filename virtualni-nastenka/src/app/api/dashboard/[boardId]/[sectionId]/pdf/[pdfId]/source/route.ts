import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import path from "path";
import { promises as fs } from "fs";
import { auth } from "@/lib/auth";

export async function GET(
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
      const { pdfId } = await params;

      const sql = `SELECT path FROM posts WHERE id = ? AND type = "pdf"`;
      const value = [pdfId];
      const [row] = await pool.execute<RowDataPacket[]>(sql, value);

      const filePath = path.join(process.cwd(), row[0].path);

      const file = await fs.readFile(filePath);

      return new Response(file, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
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
