import { pool } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import path from "path";
import sharp from "sharp";
import { rm } from "fs/promises";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const sql = `SELECT id, url FROM board_pictures`;
      const [pictures] = await pool.query<RowDataPacket[]>(sql);

      return Response.json({ pictures });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let connection;
  let picturePath;
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      connection = await pool.getConnection();

      const formData = await request.formData();
      const boardPicture = formData.get("board-picture");
      if (!boardPicture) {
        return Response.json({ error: "missingBoardPicture" }, { status: 400 });
      }

      if (boardPicture instanceof File && boardPicture?.size > 0) {
        const ext = path.extname(boardPicture.name);
        const newNamePicture = `${crypto.randomUUID()}${ext}`;

        const newPicturePath = `/private/boards/thumbnails/${newNamePicture}`;
        const sql = `INSERT INTO board_pictures (path, url) VALUES (?, ?)`;
        const value = [newPicturePath, ""];
        await connection.beginTransaction();
        const [result] = await connection.execute<ResultSetHeader>(sql, value);

        const url = `/api/dashboard/add-board/pictures/${result.insertId}/source`;
        const updateSql = `UPDATE board_pictures SET url = ? WHERE id = ?`;
        const updateValue = [url, result.insertId];
        await connection.execute<ResultSetHeader>(updateSql, updateValue);

        const bytes = await boardPicture.arrayBuffer();
        const buffer = Buffer.from(bytes);

        picturePath = path.join(
          process.cwd(),
          "/private/boards/thumbnails",
          newNamePicture
        );

        /* failOnError ignoruje drobné chyby na jinak platných obrázcích viz https://github.com/lovell/sharp/issues/2780 */
        await sharp(buffer, { failOnError: false })
          .resize(1280)
          .toFile(picturePath);

        await connection.commit();

        return Response.json({
          id: result.insertId,
          message: "successAddPicture",
        });
      } else {
        return Response.json({ error: "notFoundPicture" }, { status: 404 });
      }
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    await connection?.rollback();
    if (picturePath) {
      await rm(picturePath);
    }
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  } finally {
    connection?.release();
  }
}
