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
      const sql = `SELECT id, name, url, checked FROM sections`;
      const [sections] = await pool.query<RowDataPacket[]>(sql);

      return Response.json({ sections: sections, message: "success" });
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
      const name = formData.get("section-name") as string;
      const sectionPicture = formData.get("section-picture") as File;
      if (!name) {
        return Response.json({ error: "missingName" }, { status: 400 });
      }
      if (!sectionPicture) {
        return Response.json(
          { error: "missingSectionPicture" },
          { status: 400 }
        );
      }

      if (name.length > 30) {
        return Response.json({ error: "nameTooLong" }, { status: 400 });
      }

      if (sectionPicture instanceof File && sectionPicture.size > 0) {
        const ext = path.extname(sectionPicture.name);
        const newNamePicture = `${crypto.randomUUID()}${ext}`;

        const newPicturePath = `/private/boards/sections/thumbnails/${newNamePicture}`;
        const sql = `INSERT INTO sections (name, path, url) VALUES (?, ?, ?)`;
        const value = [name, newPicturePath, ""];
        await connection.beginTransaction();
        const [result] = await connection.execute<ResultSetHeader>(sql, value);

        const url = `/api/dashboard/add-board/sections/${result.insertId}/source`;
        const updateSql = `UPDATE sections SET url = ? WHERE id = ?`;
        const updateValue = [url, result.insertId];
        await connection.execute<ResultSetHeader>(updateSql, updateValue);

        const bytes = await sectionPicture.arrayBuffer();
        const buffer = Buffer.from(bytes);

        picturePath = path.join(
          process.cwd(),
          "/private/boards/sections/thumbnails",
          newNamePicture
        );

        /* failOnError ignoruje drobné chyby na jinak platných obrázcích viz https://github.com/lovell/sharp/issues/2780 */
        await sharp(buffer, { failOnError: false })
          .resize(1280)
          .toFile(picturePath);

        await connection.commit();

        return Response.json({
          id: result.insertId,
          message: "successCreateSection",
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
    const errorType = error as { code?: string };
    if (errorType?.code === "ER_DUP_ENTRY") {
      return Response.json({ error: "notUniqueName" }, { status: 400 });
    }
    return Response.json({ error: "serverError" }, { status: 500 });
  } finally {
    connection?.release();
  }
}
