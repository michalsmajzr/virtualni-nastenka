import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user) {
      const { id } = session?.user;

      const sql = `SELECT firstname, surname, phone, url FROM users WHERE id = ?`;
      const value = [id];
      const [rows] = await pool.execute<RowDataPacket[]>(sql, value);

      const user = rows[0];
      if (user) {
        return Response.json({
          firstname: user.firstname,
          surname: user.surname,
          phone: user.phone,
          url: user.url,
        });
      } else {
        return Response.json({ error: "notFoundUser" }, { status: 404 });
      }
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
