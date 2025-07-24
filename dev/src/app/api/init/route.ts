import { pool } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const role = "teacher";
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync("root", salt);

    const sql = `SELECT id FROM users WHERE role = "teacher" `;
    const [row] = await pool.query<RowDataPacket[]>(sql);

    if (row[0]) {
      const updateSql = `UPDATE users SET firstname = ?, surname = ?, phone = ?, email = ?, password = ? WHERE id = ?`;
      const updateValues = [
        "Virtualní",
        "Nástěnka",
        "785 125 478",
        "teacher@virtualninastenka.com",
        password,
        row[0].id,
      ];
      await pool.execute<ResultSetHeader>(updateSql, updateValues);
    } else {
      const insertSql = `INSERT INTO users (firstname, surname, phone, email, password, role) VALUES (?, ?, ?, ?, ?, ?)`;
      const insertValues = [
        "Virtualní",
        "Nástěnka",
        "785 125 478",
        "teacher@virtualninastenka.com",
        password,
        role,
      ];
      await pool.execute<ResultSetHeader>(insertSql, insertValues);
    }

    return Response.json({ message: "success" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
