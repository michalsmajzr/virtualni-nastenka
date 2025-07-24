import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      userId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const { userId } = await params;

      const sql = `SELECT firstname, surname, email, phone, url FROM users WHERE id = ?`;
      const value = [userId];
      const [row] = await pool.execute<RowDataPacket[]>(sql, value);

      const user = row[0];
      if (user) {
        return Response.json({
          firstname: user.firstname,
          surname: user.surname,
          email: user.email,
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

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      userId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const { userId } = await params;

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

      const sql = `UPDATE users SET firstname = ?, surname = ?, phone = ?  WHERE id = ?`;
      const values = [firstname, surname, phone, userId];
      await pool.execute(sql, values);

      return Response.json({ message: "successChangeUser" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      userId: string;
    }>;
  }
) {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const { userId } = await params;

      const sql = `SELECT role FROM users WHERE id = ?`;
      const value = [userId];
      const [rows] = await pool.execute<RowDataPacket[]>(sql, value);
      const user = rows[0];
      if (user.role == "teacher") {
        return Response.json({ error: "deleteTeacher" }, { status: 401 });
      }

      const deleteSql = `DELETE FROM users WHERE id = ?`;
      const valueId = [userId];
      await pool.execute(deleteSql, valueId);

      return Response.json({ message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
