import { pool } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import { type NextRequest } from "next/server";
import { mailer } from "@/lib/mailer";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      const sql = `SELECT id, url, firstname, surname, email, phone FROM users WHERE role != "teacher"`;
      const [users] = await pool.query(sql);

      return Response.json({ users, message: "success" });
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
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      connection = await pool.getConnection();

      const data = await request.json();
      const { firstname, surname, phone, email } = data;
      if (!firstname) {
        return Response.json({ error: "missingFirstname" }, { status: 400 });
      }
      if (!surname) {
        return Response.json({ error: "missingSurname" }, { status: 400 });
      }
      if (!email) {
        return Response.json({ error: "missingEmail" }, { status: 400 });
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
      if (email.length > 255) {
        return Response.json({ error: "emailTooLong" }, { status: 400 });
      }
      if (phone.length > 20) {
        return Response.json({ error: "phoneTooLong" }, { status: 400 });
      }

      const role = "user";
      const token = mailer(email);

      const searchTeacherSql = `SELECT id FROM users WHERE role = "teacher"`;
      const [rows] = await pool.query<RowDataPacket[]>(searchTeacherSql);
      const teacher = rows[0];
      const teacherId = teacher.id;

      const sql = `INSERT INTO users (firstname, surname, phone, email, role, token) VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [firstname, surname, phone, email, role, token];
      await connection.beginTransaction();
      const [parent] = await connection.execute<ResultSetHeader>(sql, values);
      const idParent = parent.insertId;

      const createConversationSql = `INSERT INTO conversations (id_teacher, id_parent) VALUES (?, ?)`;
      const createConversationValues = [teacherId, idParent];
      await connection.execute(createConversationSql, createConversationValues);
      await connection.commit();

      return Response.json({ message: "successCreateUser" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    await connection?.rollback();
    console.error(error);
    const errorType = error as { code?: string };
    if (errorType?.code === "ER_DUP_ENTRY") {
      return Response.json({ error: "notUniqueEmail" }, { status: 400 });
    }
    return Response.json({ error: "serverError" }, { status: 500 });
  } finally {
    connection?.release();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    const data = await request.json();
    const { newPassword, newConfirmPassword } = data;
    if (!newPassword) {
      return Response.json({ error: "missingNewPassword" }, { status: 400 });
    }
    if (!newConfirmPassword) {
      return Response.json(
        { error: "missingNewConfirmPassword" },
        { status: 400 }
      );
    }

    if (newPassword === newConfirmPassword) {
      const salt = bcrypt.genSaltSync();
      const password = bcrypt.hashSync(newPassword, salt);
      const updateSql = `UPDATE users SET password = ?, token = NULL WHERE token = ?`;
      const values = [password, token];
      const [result] = await pool.execute<ResultSetHeader>(updateSql, values);
      if (result.affectedRows) {
        return Response.json({ message: "success" });
      } else {
        return Response.json({ error: "unauthorized" }, { status: 401 });
      }
    } else {
      return Response.json(
        { error: "confirmPasswordDoNotMatch" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
