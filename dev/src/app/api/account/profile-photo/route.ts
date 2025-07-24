import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import path from "path";
import sharp from "sharp";
import { auth } from "@/lib/auth";
import { rm } from "fs/promises";

export async function PUT(request: Request) {
  let connection;
  let filePath;
  try {
    const session = await auth();
    if (session?.user) {
      const { id } = session?.user;

      connection = await pool.getConnection();

      const formData = await request.formData();
      const profilePhoto = formData.get("profile-photo");
      if (!profilePhoto) {
        return Response.json({ error: "missingProfilePhoto" }, { status: 400 });
      }

      const sql = `SELECT id, path FROM users WHERE id = ?`;
      const value = [id];
      const [rows] = await connection.execute<RowDataPacket[]>(sql, value);
      const user = rows[0];
      if (user) {
        if (profilePhoto instanceof File && profilePhoto?.size > 0) {
          const ext = path.extname(profilePhoto.name);
          const newNameProfilePhoto = `${crypto.randomUUID()}${ext}`;

          const bytes = await profilePhoto.arrayBuffer();
          const buffer = Buffer.from(bytes);

          filePath = path.join(
            process.cwd(),
            "/private/profile-photo/",
            newNameProfilePhoto
          );

          /* failOnError ignoruje drobné chyby na jinak platných obrázcích viz https://github.com/lovell/sharp/issues/2780 */
          await sharp(buffer, { failOnError: false })
            .resize(320)
            .toFile(filePath);

          const newFilePath = `/private/profile-photo/${newNameProfilePhoto}`;
          const url = `/api/account/profile-photo/${id}/source`;
          const sql = `UPDATE users SET path = ?, url = ? WHERE id = ?`;
          const values = [newFilePath, url, id];
          await connection.beginTransaction();
          await connection.execute(sql, values);

          const oldNameProfilePhoto = user.path;
          if (oldNameProfilePhoto) {
            const oldPath = path.join(process.cwd(), oldNameProfilePhoto);
            await rm(oldPath);
          }
          await connection.commit();
          return Response.json({
            profilePhoto: newFilePath,
            message: "successChangeProfilePhoto",
          });
        } else {
          return Response.json({ error: "userNotFound" }, { status: 404 });
        }
      } else {
        return Response.json({ error: "emailDoNotMatch" }, { status: 401 });
      }
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    await connection?.rollback();
    console.error(error);
    if (filePath) {
      await rm(filePath, { force: true });
    }
    return Response.json({ error: "serverError" }, { status: 500 });
  } finally {
    connection?.release();
  }
}

export async function DELETE() {
  let connection;
  let filePath;
  try {
    const session = await auth();
    if (session?.user) {
      const { id } = session?.user;

      connection = await pool.getConnection();

      const sql = `SELECT id, path FROM users WHERE id = ?`;
      const value = [id];
      const [rows] = await connection.execute<RowDataPacket[]>(sql, value);
      const user = rows[0];
      if (user) {
        const updateSql = `UPDATE users SET path = ?, url = ? WHERE id = ?`;
        const values = [null, null, id];
        await connection.beginTransaction();
        await connection.execute(updateSql, values);

        const oldNameProfilePhoto = user.path;
        filePath = path.join(process.cwd(), oldNameProfilePhoto);
        await rm(filePath);
        await connection.commit();

        return Response.json({ message: "success" });
      } else {
        return Response.json({ error: "userNotFound" }, { status: 404 });
      }
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    await connection?.rollback();
    console.error(error);
    if (filePath) {
      await rm(filePath, { force: true });
    }
    return Response.json({ error: "serverError" }, { status: 500 });
  } finally {
    connection?.release();
  }
}
