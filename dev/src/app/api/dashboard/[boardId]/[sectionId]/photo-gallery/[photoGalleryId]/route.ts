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
      photoGalleryId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user) {
      const { photoGalleryId } = await params;

      const postSql = `SELECT name FROM posts WHERE id = ?`;
      const postValue = [photoGalleryId];
      const [post] = await pool.execute<RowDataPacket[]>(postSql, postValue);

      const photosSql = `SELECT id, url as src, thumbnail_url, thumbnail_width, thumbnail_height FROM photo_gallery WHERE id_post = ?`;
      const photosValue = [photoGalleryId];
      const [photos] = await pool.execute<RowDataPacket[]>(
        photosSql,
        photosValue
      );

      return Response.json({
        name: post[0].name,
        photos: photos,
        message: "success",
      });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
