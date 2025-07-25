import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import { auth } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (session?.user) {
      const { id } = session?.user;

      const data = await request.json();
      const { oldPassword, newPassword, newConfirmPassword } = data;
      if (!oldPassword) {
        return Response.json({ error: "missingOldPassword" }, { status: 400 });
      }
      if (!newPassword) {
        return Response.json({ error: "missingNewPassword" }, { status: 400 });
      }
      if (!newConfirmPassword) {
        return Response.json(
          { error: "missingNewConfirmPassword" },
          { status: 400 }
        );
      }

      const sql = `SELECT * FROM users WHERE id = ?`;
      const value = [id];
      const [rows] = await pool.execute<RowDataPacket[]>(sql, value);

      const user = rows[0];
      if (user) {
        if (await bcrypt.compare(oldPassword, user.password)) {
          if (newPassword === newConfirmPassword) {
            const salt = bcrypt.genSaltSync();
            const password = bcrypt.hashSync(newPassword, salt);
            const updateSql = `UPDATE users SET password = ? WHERE id = ?`;
            const values = [password, id];
            await pool.execute<RowDataPacket[]>(updateSql, values);

            return Response.json({ message: "successChangeEmail" });
          } else {
            return Response.json(
              { error: "confirmPasswordDoNotMatch" },
              { status: 401 }
            );
          }
        } else {
          return Response.json(
            { error: "oldPasswordDoNotMatch" },
            { status: 401 }
          );
        }
      } else {
        return Response.json({ error: "userNotFound" }, { status: 404 });
      }
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
