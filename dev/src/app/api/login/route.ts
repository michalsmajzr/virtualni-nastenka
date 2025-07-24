import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password } = data;
    if (!email || !password) {
      return Response.json(
        { error: "missingEmailOrPassword" },
        { status: 400 }
      );
    }

    const sql = `SELECT id, role, password FROM users WHERE email = ?`;
    const value = [email];
    const [rows] = await pool.execute<RowDataPacket[]>(sql, value);

    const user = rows[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      return Response.json({ user });
    } else {
      return Response.json(
        { error: "emailOrPasswordDoNotMatch" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
