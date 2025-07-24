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
      bulkMessageId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user) {
      const { bulkMessageId } = await params;
      console.log("asdad");

      const sql = `SELECT attachment_path, attachment_name FROM bulk_messages WHERE id = ?`;
      const value = [bulkMessageId];
      const [row] = await pool.execute<RowDataPacket[]>(sql, value);
      if (row[0]) {
        const filePath = path.join(process.cwd(), row[0].attachment_path);
        const file = await fs.readFile(filePath);

        const type = mime.getType(filePath);

        return new Response(file, {
          status: 200,
          headers: {
            "Content-Type": type ?? "application/octet-stream",
            "Content-Length": file.length.toString(),
            "Content-Disposition": `attachment; filename="${row[0].attachment_name}"`,
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
