import { pool } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import path from "path";
import sharp from "sharp";
import { mkdir } from "fs/promises";
import { rm } from "fs/promises";
import { auth } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ boardId: string; sectionId: string }> }
) {
  let connection;
  let rmPath;
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      connection = await pool.getConnection();

      const { boardId, sectionId } = await params;

      const formData = await request.formData();
      const name = formData.get("name") as string;
      const photos = formData.getAll("photo") as File[];
      if (!name) {
        return Response.json({ error: "missingName" }, { status: 400 });
      }
      if (!photos) {
        return Response.json({ error: "missingPhoto" }, { status: 400 });
      }

      if (name.length > 30) {
        return Response.json({ error: "nameTooLong" }, { status: 400 });
      }

      if (photos[0] instanceof File && photos[0]?.size > 0) {
        const type = "photo";
        const postSql = `INSERT INTO posts (id_section, type, name, thumbnail_path, thumbnail_url) VALUES (?, ?, ?, ?, ?)`;
        const postValues = [sectionId, type, name, "", ""];
        await connection.beginTransaction();
        const [postResult] = await connection.execute<ResultSetHeader>(
          postSql,
          postValues
        );
        const ext = path.extname(photos[0].name);
        const thumbnailPostName = `${crypto.randomUUID()}${ext}`;

        const bytes = await photos[0].arrayBuffer();
        const buffer = Buffer.from(bytes);

        rmPath = path.join(
          process.cwd(),
          `/private/boards/${boardId}/${sectionId}/${postResult.insertId}`
        );
        const directoryPath = path.join(
          process.cwd(),
          `/private/boards/${boardId}/${sectionId}/${postResult.insertId}/thumbnail`
        );
        await mkdir(directoryPath, { recursive: true });
        const thumbnailPostPath = path.join(
          process.cwd(),
          `/private/boards/${boardId}/${sectionId}/${postResult.insertId}/thumbnail`,
          thumbnailPostName
        );
        /* failOnError ignoruje drobné chyby na jinak platných obrázcích viz https://github.com/lovell/sharp/issues/2780 */
        await sharp(buffer, { failOnError: false })
          .resize(1280)
          .toFile(thumbnailPostPath);

        const newThumbnailPostPath = `/private/boards/${boardId}/${sectionId}/${postResult.insertId}/thumbnail/${thumbnailPostName}`;
        const url = `/api/dashboard/${boardId}/${sectionId}/${postResult.insertId}/source`;
        const updateSql = `UPDATE posts SET thumbnail_path = ?, thumbnail_url = ? WHERE id = ?`;
        const updateValues = [newThumbnailPostPath, url, postResult.insertId];
        await connection.execute<ResultSetHeader>(updateSql, updateValues);

        const directoryThumbanailPath = path.join(
          process.cwd(),
          `/private/boards/${boardId}/${sectionId}/${postResult.insertId}/thumbnails`
        );
        await mkdir(directoryThumbanailPath);

        for (let i = 0; i < photos.length; i++) {
          if (photos[i] instanceof File && photos[i]?.size > 0) {
            const ext = path.extname(photos[i].name);
            const newNamePhoto = `${crypto.randomUUID()}${ext}`;

            const bytes = await photos[i].arrayBuffer();
            const buffer = Buffer.from(bytes);

            const photoPath = path.join(
              process.cwd(),
              `/private/boards/${boardId}/${sectionId}/${postResult.insertId}`,
              newNamePhoto
            );
            const thumbnailPath = path.join(
              process.cwd(),
              `/private/boards/${boardId}/${sectionId}/${postResult.insertId}/thumbnails`,
              newNamePhoto
            );

            await sharp(buffer, { failOnError: false })
              .resize(1920)
              .toFile(photoPath);
            const thumbnail = await sharp(buffer, { failOnError: false })
              .resize(1280)
              .toFile(thumbnailPath);

            const newPhotoPath = `/private/boards/${boardId}/${sectionId}/${postResult.insertId}/${newNamePhoto}`;
            const newThumbnailPath = `/private/boards/${boardId}/${sectionId}/${postResult.insertId}/thumbnails/${newNamePhoto}`;
            const photoSql = `INSERT INTO photo_gallery (id_post, path, url, thumbnail_path, thumbnail_url, thumbnail_width, thumbnail_height) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const photoValues = [
              postResult.insertId,
              newPhotoPath,
              "",
              newThumbnailPath,
              "",
              thumbnail.width,
              thumbnail.height,
            ];

            const [result] = await connection.execute<ResultSetHeader>(
              photoSql,
              photoValues
            );

            const thumbnailUrl = `/api/dashboard/${boardId}/${sectionId}/photo-gallery/thumbnails/${result.insertId}/source`;
            const url = `/api/dashboard/${boardId}/${sectionId}/photo-gallery/photos/${result.insertId}/source`;
            const updateSql = `UPDATE photo_gallery SET url = ?, thumbnail_url = ? WHERE id = ?`;
            const updateValues = [url, thumbnailUrl, result.insertId];
            await connection.execute<ResultSetHeader>(updateSql, updateValues);
          } else {
            throw new Error("notFoundPhoto");
          }
        }
        await connection.commit();

        return Response.json({ message: "successAddPhotos" });
      } else {
        return Response.json({ error: "notFoundPhoto" }, { status: 404 });
      }
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    await connection?.rollback();
    if (rmPath) {
      await rm(rmPath, { recursive: true, force: true });
    }
    console.error(error);
    const errorType = error as { code?: string };
    if (errorType?.code === "ER_DUP_ENTRY") {
      return Response.json({ error: "notUniqueName" }, { status: 400 });
    }
    if (error instanceof Error && error.message === "notFoundPhoto") {
      return Response.json({ error: "notFoundPhoto" }, { status: 404 });
    } else {
      return Response.json({ error: "serverError" }, { status: 500 });
    }
  } finally {
    connection?.release();
  }
}
