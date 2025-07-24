import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (session?.user) {
      const { id } = session?.user;

      const data = await request.json();
      const { firstname, surname, phone } = data;
      if (!firstname) {
        return Response.json({ error: "missingFirstname" }, { status: 400 });
      }
      if (!surname) {
        return Response.json({ error: "missingSurname" }, { status: 400 });
      }
      if (!phone) {
        return Response.json({ error: "missingPhone" }, { status: 400 });
      }

      if (firstname.length > 30) {
        return Response.json({ error: "firstnameTooLong" }, { status: 400 });
      }
      if (surname.length > 30) {
        return Response.json({ error: "surnameTooLong" }, { status: 400 });
      }
      if (phone.length > 20) {
        return Response.json({ error: "phoneTooLong" }, { status: 400 });
      }

      const sql = `UPDATE users SET firstname = ?, surname = ?, phone = ? WHERE id = ?`;
      const values = [firstname, surname, phone, id];
      await pool.execute<RowDataPacket[]>(sql, values);

      return Response.json({ message: "successChangeUser" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
